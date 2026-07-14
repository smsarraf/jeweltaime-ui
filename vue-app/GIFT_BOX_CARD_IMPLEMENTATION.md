# GiftBox & GiftCard Implementation Guide

## Overview

This implementation provides users with the ability to select gift services for their purchases during checkout. Both GiftBox and GiftCard are presented as radio button selections with visual media (images and videos) when available.

## Features

### 1. GiftCard Service
- **Price**: $5 per item (configurable)
- **Visual Display**: Image and/or video URL support
- **Quantity**: Applied per item in cart (scales with item quantity)
- **API Endpoint**: `GET /api/v1/gift-cards/active`

### 2. GiftBox Service
- **Multiple Options**: Different gift box styles and sizes
- **Pricing**: Variable pricing per box
- **Visual Display**: Each box shows image and/or video URL
- **Selection**: One gift box per cart item
- **API Endpoint**: `GET /api/v1/gift-boxes/active`

### 3. No Additional Service
- Option to skip gift services entirely
- Free option displayed first

## API Endpoints

### Get Active Gift Boxes
```
GET /api/v1/gift-boxes/active
```

**Response Schema:**
```json
[
  {
    "id": 1,
    "name": "Premium Gift Box",
    "description": "Elegant premium packaging with tissue paper",
    "priceUsd": 12.99,
    "imageUrl": "http://localhost:3000/uploads/gift-boxes/premium.jpg",
    "videoUrl": "http://localhost:3000/uploads/gift-boxes/premium-demo.mp4",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Standard Gift Box",
    "description": "Standard white box with basic packaging",
    "priceUsd": 5.99,
    "imageUrl": "http://localhost:3000/uploads/gift-boxes/standard.jpg",
    "videoUrl": null,
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### Get Active Gift Cards
```
GET /api/v1/gift-cards/active
```

**Response Schema:**
```json
{
  "id": 1,
  "name": "Gift Card",
  "description": "Digital or physical gift card",
  "priceUsd": 5.00,
  "imageUrl": "http://localhost:3000/uploads/gift-cards/card.jpg",
  "videoUrl": "http://localhost:3000/uploads/gift-cards/how-to-use.mp4",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## Component Structure

### GiftServiceSelector Component
**Location:** `src/components/GiftServiceSelector.vue`

**Props:**
- `item` (Object): The cart item being configured
- `modelValue` (String): Current selection value (empty string, 'CARD', or 'BOX:{id}')
- `giftNote` (String): Personal gift note text
- `giftBoxes` (Array): Array of available gift boxes
- `giftCardPrice` (Number): Price of gift card service
- `giftCardImage` (String): URL to gift card image
- `giftCardVideo` (String): URL to gift card video
- `formatPrice` (Function): Currency formatter function

**Events:**
- `@update:modelValue`: Emitted when selection changes
- `@update:giftNote`: Emitted when gift note text changes

**Features:**
- Radio button selection for each option
- Image/video preview with click-to-expand modal
- Gift note textarea
- Responsive design
- Hover effects and visual feedback

### Checkout Integration
**Location:** `src/pages/Checkout.vue`

**Key Functions:**
- `loadGiftBoxes()`: Fetches active gift boxes from API
- `loadGiftCardData()`: Fetches gift card data (image/video)
- `onGiftServiceChange(itemKey, value)`: Handles selection changes
- `parseGiftService(selectionValue)`: Parses service type and ID
- `getGiftServicePriceForItem(item)`: Calculates price for item

**Computed Properties:**
- `giftServicesTotal`: Sum of all gift service prices in cart

## Usage Example

### In Checkout Page
```vue
<GiftServiceSelector
  :item="item"
  :modelValue="itemGiftSelections[getCartItemKey(item)] || ''"
  :giftNote="itemGiftNotes[getCartItemKey(item)] || ''"
  :giftBoxes="giftBoxes"
  :giftCardPrice="giftCardServicePrice"
  :giftCardImage="giftCardImage"
  :giftCardVideo="giftCardVideo"
  :formatPrice="currencyStore.formatPrice"
  @update:modelValue="onGiftServiceChange(getCartItemKey(item), $event)"
  @update:giftNote="itemGiftNotes[getCartItemKey(item)] = $event"
/>
```

## Order Data Structure

When an order is created with gift services, the order items include:

```javascript
{
  productId: 123,
  quantity: 2,
  giftBoxId: 2,           // Only present for BOX selection
  giftNote: "Happy Birthday!" // Personal message (optional)
}
```

For Gift Cards, the service type is encoded in the `giftNote`:
```javascript
{
  productId: 456,
  quantity: 1,
  giftNote: "Gift Card Service (+$5.00 per item) | Personal note here"
}
```

## Styling Features

### Visual Elements
- **Radio Button Cards**: Bordered cards with hover effects
- **Media Display**: Images and videos embedded in selection cards
- **Modal Preview**: Click images/videos to open fullscreen view
- **Responsive Layout**: Adapts to mobile, tablet, and desktop
- **Color Coding**: Green pricing highlight for quick scanning

### Responsive Breakpoints
- Mobile: Single column layout
- Tablet: Cards stack properly
- Desktop: Full visual display with all media

## Configuration

### Default Gift Card Price
Located in `Checkout.vue`:
```javascript
const giftCardServicePrice = 5
```

To change, update the constant and ensure it matches backend pricing.

### Media URLs
- All URLs support JPEG, PNG, GIF, WebP for images
- Video formats: MP4, WebM, OGG
- URLs are constructed from: `http://localhost:3000/uploads/...`

## Error Handling

- If gift box API fails, component loads without gift boxes (still shows Gift Card)
- If gift card API fails, component continues without card media
- Missing media URLs are gracefully handled (only displayed if provided)
- Invalid selections default to "No Additional Service"

## Future Enhancements

1. **Bulk Gift Services**: Select same gift box for all items at once
2. **Gift Message Preview**: Show rendered gift message
3. **Gift Service Analytics**: Track which services are most popular
4. **Scheduled Gift Delivery**: Plan gift delivery for future dates
5. **Custom Gift Messages**: Allow longer, richer text formatting
6. **Gift Wrapping Options**: Add integration with wrapping services
7. **Digital Gift Cards**: Email delivery option

## Testing

### Manual Testing Checklist
- [ ] Load checkout page with items in cart
- [ ] Verify gift boxes load from API
- [ ] Verify gift card media loads
- [ ] Select each gift option and verify price updates
- [ ] Click images/videos to open modal
- [ ] Add gift note and verify it saves
- [ ] Change selection multiple times
- [ ] Remove items and verify gift selections clear
- [ ] Create order and verify gift services included
- [ ] Test on mobile/tablet/desktop

### Sample cURL Commands
```bash
# Get active gift boxes
curl http://localhost:3000/api/v1/gift-boxes/active

# Get active gift cards
curl http://localhost:3000/api/v1/gift-cards/active
```

## Troubleshooting

### Gift boxes not loading
1. Verify `/api/v1/gift-boxes/active` returns data
2. Check browser console for errors
3. Ensure API is running at configured URL
4. Check network tab in DevTools

### Images/videos not displaying
1. Verify URL format is correct
2. Check CORS headers if external URLs
3. Verify file exists at location
4. Check browser console for CORS errors

### Gift services not appearing in order
1. Verify `createOrder()` function includes gift fields
2. Check backend order schema accepts giftBoxId/giftNote
3. Verify parseGiftService() returns correct format

## References

- Component: `src/components/GiftServiceSelector.vue`
- Integration: `src/pages/Checkout.vue`
- API Base URL: Configured in `.env` as `VITE_API_URL`
- Bootstrap Classes: Using Bootstrap 5 utility classes
- Vue Version: Vue 3 with Composition API

