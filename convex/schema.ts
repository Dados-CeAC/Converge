import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tabela_mae: defineTable({
    id: v.string(),
    nome_empresa: v.string(),
    nome_filial: v.string(),
    local_trabalho: v.string(),
    cargo: v.string(),
    funcao: v.string(),
    descricao_situacao: v.string(),
    data_situacao: v.optional(v.string()), // <- Permite receber a data sem travar
  }),
  tabela_filha: defineTable({
    id: v.string(),
    nome_filial: v.string(),
    local_trabalho: v.string(),
  }),
});
