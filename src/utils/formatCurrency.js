import React from 'react'

const formatCurrency = (valeu) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valeu)
}

export default formatCurrency
