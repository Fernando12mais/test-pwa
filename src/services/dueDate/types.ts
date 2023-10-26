export type DueDateResponse = {
  cdVencimento: number;
  dsVencimento: string;
}[];

export type ProcesseDueDateResponse = {
  id: DueDateResponse[0]['cdVencimento'];
  label: DueDateResponse[0]['dsVencimento'];
}[];
