import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tabela Mãe (1 registro por CPF: cpf, matricula, vinculo, situacao)
  tabela_mae: defineTable({
    cpf: v.string(),
    matricula: v.string(),
    vinculo: v.string(),
    situacao: v.string(),
  }).index("by_cpf", ["cpf"]),

  // Tabela Filha (Estrutura completa com N registros por CPF)
  tabela_filha: defineTable({
    seq_id: v.number(),
    cpf: v.string(),
    matricula: v.string(),
    vinculo: v.string(),
    situacao: v.string(),
    grupo_generico: v.string(),
    empresa: v.string(),
    filial: v.string(),
    local_trab: v.string(),
    cargo: v.string(),
    funcao: v.string(),
  })
    .index("by_cpf", ["cpf"])
    .index("by_situacao", ["situacao"]),
});