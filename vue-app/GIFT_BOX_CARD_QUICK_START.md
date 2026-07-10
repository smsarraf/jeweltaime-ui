# GiftBox & GiftCard - Quick Start Guide

## What Was Implemented

You now have a complete GiftBox and GiftCard selection system in your Checkout page with:

### ✅ Features Implemented
1. **Radio Button Selection** - Users can select between:
   - No Additional Service (free)
   - Gift Card ($5 per item)
   - Multiple Gift Box options (custom pricing)

2. **Visual Media Display**
   - Images: Displayed inline in selection cards
   - Videos: Embedded with controls
   - Click-to-expand modal for full-size preview

3. **Gift Notes** - Each item can have a personal gift message

4. **Price Calculation**
   - Automatic price updates based on selection
   - Per-item pricing (scales with quantity)
   - Included in order total

5. **Responsive Design**
   - Mobile-friendly
   - Touch-friendly radio buttons
   - Clean card-based layout

## Files Modified & Created

### New Files
1. **`src/components/GiftServiceSelector.vue`** - Main gift selection component
2. **`GIFT_BOX_CARD_IMPLEMENTATION.md`** - Complete documentation

### Modified Files
1. **`src/pages/Checkout.vue`**
   - Added import for GiftServiceSelector component
   - Replaced dropdown gift selection with new component
   - Added gift card data loading
   - Enhanced gift service handling

## Getting Started

### 1. Ensure API Endpoints Exist

Your backend should provide these endpoints:

```
GET /api/v1/gift-boxes/active
GET /api/v1/gift-cards/active
```

### 2. Test the Component

Load the Checkout page and:
- ✓ Verify gift boxes load from API
- ✓ See gift card option with media
- ✓ Click images/videos to preview
- ✓ Add gift note
- ✓ Select different options and verify price updates
- ✓ Create an order and verify gift services are included

### 3. Customize Settings

In `Checkout.vue`, you can customize:

```javascript
// Change gift card price
const giftCardServicePrice = 5  // Line 444

// Or in loadGiftCardData() for dynamic pricing:
// const giftCard = await axios.get(`${API_BASE}/api/v1/gift-cards/active`)
```

## Expected API Responses

### Gift Boxes Response
```json
[
  {
    "id": 1,
    "name": "Premium Gift Box",
    "description": "Elegant packaging",
    "priceUsd": 12.99,
    "imageUrl": "http://localhost:8081/uploads/...",
    "videoUrl": "http://localhost:8081/uploads/...",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Standard Box",
    "description": "Basic packaging",
    "priceUsd": 5.99,
    "imageUrl": "...",
    "videoUrl": null,
    "isActive": true
  }
]
```

### Gift Cards Response
```json
{
  "id": 1,
  "name": "Gift Card",
  "priceUsd": 5.00,
  "imageUrl": "http://localhost:8081/uploads/...",
  "videoUrl": "http://localhost:8081/uploads/...",
  "isActive": true
}
```

## How Gift Services Appear in Orders

When creating an order with gift services:

```javascript
// For Gift Box selection
{
  productId: 123,
  quantity: 2,
  giftBoxId: 1,           // Gift box ID
  giftNote: "Happy Birthday!"
}

// For Gift Card selection
{
  productId: 456,
  quantity: 1,
  giftNote: "Gift Card Service (+$5.00 per item) | Personal message here"
}
```

## Component Props Reference

```vue
<GiftServiceSelector
  :item="item"                           <!-- Cart item object -->
  :modelValue="selectedValue"            <!-- Current selection (empty/'CARD'/'BOX:{id}') -->
  :giftNote="note"                       <!-- Personal message -->
  :giftBoxes="giftBoxes"                 <!-- Array of gift box options -->
  :giftCardPrice="5"                     <!-- Gift card price -->
  :giftCardImage="imageUrl"              <!-- Gift card image URL -->
  :giftCardVideo="videoUrl"              <!-- Gift card video URL -->
  :formatPrice="priceFormatter"          <!-- Currency formatter function -->
  @update:modelValue="handleSelection"   <!-- Selection change handler -->
  @update:giftNote="handleNoteChange"    <!-- Note change handler -->
/>
```

## Styling Customization

The component uses Bootstrap 5 classes and scoped styles. To customize:

1. **Colors**: Edit `.gift-option-price` color in GiftServiceSelector.vue
2. **Spacing**: Adjust `margin` and `padding` classes
3. **Border styles**: Modify `.gift-option-card` border properties
4. **Media sizing**: Change `max-height` in `.gift-option-media`

## Troubleshooting

### Gift boxes not showing?
```javascript
// Check in browser console:
// 1. Open DevTools → Network tab
// 2. Look for GET /api/v1/gift-boxes/active
// 3. Verify response contains data
```

### Images not displaying?
```javascript
// Verify URL format:
// - Should start with http:// or https://
// - Should point to valid image file
// - Check CORS headers if external URL
```

### Prices not updating?
```javascript
// Debug in browser console:
// Look at giftBoxes ref and verify it contains priceUsd field
```

## Common Customizations

### Change Gift Card Price
```javascript
// In Checkout.vue, line 444:
const giftCardServicePrice = 10  // Changed from 5
```

### Add Gift Box Category
```javascript
// In GiftServiceSelector.vue, add after gift card section:
<optgroup label="Premium Boxes">
  <option>...</option>
</optgroup>
```

### Disable Gift Services
```javascript
// In Checkout.vue, simply don't load or pass empty array:
const giftBoxes = ref([])
```

## Next Steps

1. **Backend Setup**: Implement the API endpoints for gift-boxes and gift-cards
2. **Media Upload**: Upload images/videos for gift boxes
3. **Testing**: Test full checkout flow with different selections
4. **Analytics**: Track which gift services are most popular
5. **Marketing**: Add promotions for gift services

## Support & Documentation

For detailed information, see: `GIFT_BOX_CARD_IMPLEMENTATION.md`

Key Sections:
- API Endpoints - Complete specification
- Component Structure - Detailed props and events
- Order Data Structure - How gift services are stored
- Testing - Manual testing checklist
- Troubleshooting - Common issues and solutions

