export interface EquipmentModel {
  EquipmentModelID?: number;
  EquipmentManufacturerID?: number;
  EquipmentManufacturerName?: string;
  EquipmentSizeID?: number;
  EquipmentSizeName?: string;
  EquipmentClassID?: number;
  EquipmentClassName?: string;
  ModelName?: string;
  Active?: boolean;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  LastModifiedDateTime?: string;
  LastModifiedByUserID?: number;
  LastModifiedByUserName?: string;
  CapEXMonths?: number;
  MeterType?: string;
  FuelBurnRate?: number;
  FuelUnit?: string;
}

export type EquipmentModelsGetOutput = EquipmentModel[];
