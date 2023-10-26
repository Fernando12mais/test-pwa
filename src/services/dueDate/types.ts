export type DueDateResponse = {
  cdPessoa: number;
  dsRazaoSocialNome: string;
}[];

export type ProcesseDueDateResponse = {
  id: DueDateResponse[0]['cdPessoa'];
  label: DueDateResponse[0]['dsRazaoSocialNome'];
}[];
