function toMoney(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return num
}

function pickFirstMoney(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue
    const num = Number(value)
    if (Number.isFinite(num)) return num
  }
  return null
}

export function getOrderPricingSummary(order = {}) {
  const itemsSubtotal = toMoney(order.totalUsdPrice ?? order.totalPrice ?? 0)
  const shippingCost = toMoney(order.shippingCost ?? 0)
  const taxPercentage = toMoney(order.taxPercentage ?? 0)

  const fallbackTaxAmount = ((itemsSubtotal + shippingCost) * taxPercentage) / 100
  const taxAmount = toMoney(
    pickFirstMoney(order.taxAmount, fallbackTaxAmount)
  )

  const finalTotal = toMoney(
    pickFirstMoney(
      order.finalPayableTotal,
      order.totalDiscountedPrice,
      order.totalUsdPriceAfterDiscount,
      itemsSubtotal + shippingCost + taxAmount
    )
  )

  return {
    itemsSubtotal,
    shippingCost,
    taxPercentage,
    taxAmount,
    finalTotal
  }
}
