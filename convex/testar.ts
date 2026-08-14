import { query } from "./_generated/server";

export const buscarPrimeirosRegistros = query({
  args: {},
  handler: async (ctx) => {
    // 1. Busca os 5 primeiros registros da Tabela Mãe
    const mae = await ctx.db.query("tabela_mae").take(5);

    // 2. Busca os 5 primeiros registros da Tabela Filha ordenados pelo seq_id
    const filha = await ctx.db.query("tabela_filha").take(5);

    return {
      status: "✅ BANCO DE DADOS OPERACIONAL E CONECTADO!",
      amostra_tabela_mae: mae,
      amostra_tabela_filha: filha,
    };
  },
});
