export function mensagemErro(e, padrao = 'Erro inesperado. Tente novamente.') {
  const data = e?.response?.data
  if (typeof data === 'string' && data) return data
  if (data?.errors) return Object.values(data.errors).flat().join(' ')
  if (data?.title) return data.title
  if (!e?.response) return 'Não foi possível conectar à API.'
  return padrao
}