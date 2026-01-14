export const getDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}