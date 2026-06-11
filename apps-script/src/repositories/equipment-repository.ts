import {
  CreateEquipmentDto,
  EquipmentItem,
  EquipmentListRequest,
  UpdateEquipmentDto,
} from '@ckpharmacy/shared';
import { AuthenticatedLineUser } from '../domain';

const equipmentHeaders: Array<keyof EquipmentItem> = [
  'id',
  'itemCode',
  'name',
  'category',
  'brand',
  'model',
  'serialNumber',
  'quantity',
  'unit',
  'location',
  'condition',
  'status',
  'notes',
  'recordedByLineUserId',
  'recordedByName',
  'createdAt',
  'updatedAt',
  'deletedAt',
];

export interface EquipmentRepository {
  list(userId: string, request: EquipmentListRequest): EquipmentItem[];
  get(userId: string, id: string): EquipmentItem | null;
  create(dto: CreateEquipmentDto, user: AuthenticatedLineUser): EquipmentItem;
  update(dto: UpdateEquipmentDto, user: AuthenticatedLineUser): EquipmentItem | null;
  delete(userId: string, id: string): boolean;
  hasProcessedRequest(requestId: string): boolean;
  logRequest(requestId: string, action: string, userId: string, status: string): void;
}

export class SheetEquipmentRepository implements EquipmentRepository {
  constructor(private readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  list(userId: string, request: EquipmentListRequest): EquipmentItem[] {
    const query = request.query?.trim().toLowerCase() ?? '';
    const limit = Math.min(Math.max(request.limit ?? 50, 1), 100);

    return this.rows()
      .filter((item) => item.recordedByLineUserId === userId && !item.deletedAt)
      .filter((item) => !request.status || item.status === request.status)
      .filter((item) =>
        !query || [item.name, item.itemCode, item.category, item.serialNumber].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, limit);
  }

  get(userId: string, id: string): EquipmentItem | null {
    return this.rows().find(
      (item) => item.id === id && item.recordedByLineUserId === userId && !item.deletedAt,
    ) ?? null;
  }

  create(dto: CreateEquipmentDto, user: AuthenticatedLineUser): EquipmentItem {
    const now = new Date().toISOString();
    const item: EquipmentItem = {
      ...dto,
      id: Utilities.getUuid(),
      recordedByLineUserId: user.userId,
      recordedByName: user.displayName,
      createdAt: now,
      updatedAt: now,
      deletedAt: '',
    };

    this.withLock(() => this.equipmentSheet().appendRow(equipmentHeaders.map((header) => item[header])));
    return item;
  }

  update(dto: UpdateEquipmentDto, user: AuthenticatedLineUser): EquipmentItem | null {
    let updated: EquipmentItem | null = null;
    this.withLock(() => {
      const sheet = this.equipmentSheet();
      const rows = this.rows();
      const rowIndex = rows.findIndex(
        (item) => item.id === dto.id && item.recordedByLineUserId === user.userId && !item.deletedAt,
      );
      if (rowIndex < 0) {
        return;
      }
      const current = rows[rowIndex];
      if (!current) {
        return;
      }
      updated = { ...current, ...dto, updatedAt: new Date().toISOString() };
      sheet.getRange(rowIndex + 2, 1, 1, equipmentHeaders.length).setValues([
        equipmentHeaders.map((header) => (updated as EquipmentItem)[header]),
      ]);
    });
    return updated;
  }

  delete(userId: string, id: string): boolean {
    let deleted = false;
    this.withLock(() => {
      const sheet = this.equipmentSheet();
      const rows = this.rows();
      const rowIndex = rows.findIndex(
        (item) => item.id === id && item.recordedByLineUserId === userId && !item.deletedAt,
      );
      if (rowIndex < 0) {
        return;
      }
      const deletedAtColumn = equipmentHeaders.indexOf('deletedAt') + 1;
      const updatedAtColumn = equipmentHeaders.indexOf('updatedAt') + 1;
      const now = new Date().toISOString();
      sheet.getRange(rowIndex + 2, deletedAtColumn).setValue(now);
      sheet.getRange(rowIndex + 2, updatedAtColumn).setValue(now);
      deleted = true;
    });
    return deleted;
  }

  hasProcessedRequest(requestId: string): boolean {
    if (!requestId) {
      return false;
    }
    const sheet = this.requestLogSheet();
    if (sheet.getLastRow() < 2) {
      return false;
    }
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().some(
      ([value]) => String(value) === requestId,
    );
  }

  logRequest(requestId: string, action: string, userId: string, status: string): void {
    if (!requestId) {
      return;
    }
    this.withLock(() => this.requestLogSheet().appendRow([
      requestId,
      action,
      userId,
      status,
      new Date().toISOString(),
    ]));
  }

  private rows(): EquipmentItem[] {
    const sheet = this.equipmentSheet();
    if (sheet.getLastRow() < 2) {
      return [];
    }
    return sheet.getRange(2, 1, sheet.getLastRow() - 1, equipmentHeaders.length).getValues().map(
      (row) => Object.fromEntries(equipmentHeaders.map((header, index) => [header, row[index]])) as unknown as EquipmentItem,
    );
  }

  private equipmentSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const sheet = this.spreadsheet.getSheetByName('equipment');
    if (!sheet) {
      throw new Error('Equipment sheet is missing');
    }
    const actualHeaders = sheet.getRange(1, 1, 1, equipmentHeaders.length).getValues()[0]?.map(String);
    if (JSON.stringify(actualHeaders) !== JSON.stringify(equipmentHeaders)) {
      throw new Error('Equipment sheet headers do not match the required schema');
    }
    return sheet;
  }

  private requestLogSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const sheet = this.spreadsheet.getSheetByName('request_log');
    if (!sheet) {
      throw new Error('Request log sheet is missing');
    }
    return sheet;
  }

  private withLock(operation: () => void): void {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      operation();
    } finally {
      lock.releaseLock();
    }
  }
}

