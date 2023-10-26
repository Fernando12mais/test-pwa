export type Action = 'read' | 'write' | 'all';

export type SubjectUser = 'public' | 'client' | 'admin';

export type AbilityTuple = [Action, SubjectUser];
