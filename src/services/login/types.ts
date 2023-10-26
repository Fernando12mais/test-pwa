import { SubjectUser } from '@/plugins/casl/ability.types';

export type LoginResponse = {
  token: {
    accessToken?: string;
    tokenType: 'bearer';
    expiresIn: number;
    refreshToken: string;
  };
  user: {
    cdUsuario: number;
    cdPessoa: number;
    dsLogin: string;
    dtUltimoAcesso: Date | string;
    cdEmpresa: number;
    cdSetor: number;
    empresa: {
      dsEmpresa: string;
      dsSiglaEmpresa: string;
      dsFantasia: string;
      dsCnpjCpf: string;
    };
    pessoa: {
      dsRazaoSocialNome: string;
      dsCnpjCpf: string;
      dsCep: string;
      dsBairro: string;
      dsLogradouro: string;
      dsNumero: string;
      dsComplemento: string;
      dsCidade: string;
      cdUf: number;
    };
    setor: {
      dsSetor: string;
    };
    vendedor: {
      nome: string;
      whatsapp: string;
    };
  };
};

export type LoginError = {
  erro: string;
};

export type LoginPayload = {
  dsEmail: string;
  dsPassword: string;
};

export type LoginSubject = Exclude<SubjectUser, 'public'>;
