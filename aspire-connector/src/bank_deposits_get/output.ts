export interface BankDeposit {
  BankDepositID?: number;
  BranchID?: number;
  BranchName?: string;
  BranchCode?: string;
  DepositDate?: string;
  DepositAmount?: number;
  DepositStatus?: string;
  CreatedDateTime?: string;
  CreatedByUserID?: number;
  CreatedByUserName?: string;
  DateSentToAccounting?: string;
  SentToAccountingUserID?: number;
  SentToAccountingUserName?: string;
  AccountingMessage?: string;
  ResetToNewDate?: string;
  ResetToNewUserID?: number;
  ResetToNewUserName?: string;
}

export type BankDepositsGetOutput = BankDeposit[];
