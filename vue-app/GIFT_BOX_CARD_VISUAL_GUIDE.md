# GiftBox & GiftCard - Visual Guide & Examples

## UI Layout

### Current Checkout Page Gift Options Section

```
┌─────────────────────────────────────────────────────────────┐
│                    GIFT OPTIONS                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Product 1: Diamond Necklace - Gift Options                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ☐ No Additional Service                          Free  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ◉ Gift Card                                   +$5.00   │ │
│  │   [Gift Card Image]      [Gift Card Video]             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ☐ Premium Gift Box                          +$12.99   │ │
│  │   Elegant premium packaging with tissue paper          │ │
│  │   [Box Image]            [Box Video]                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ ☐ Standard Gift Box                          +$5.99   │ │
│  │   Standard white box with basic packaging             │ │
│  │   [Box Image]                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Gift Note (Optional)                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [Add a personal message...                           ] │ │
│  │ [                                                    ] │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Selection Flow

```
┌─────────────────┐
│ User Views Cart │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Proceeds to Checkout                 │
│ - Cart items loaded                  │
│ - Gift boxes API called              │
│ - Gift card data API called          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ GiftServiceSelector Component         │
│ - Renders for each cart item         │
│ - Shows all available options        │
│ - Displays media (images/videos)     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ User Actions:                        │
│ 1. Select gift option (radio)        │
│ 2. Add personal note (optional)      │
│ 3. Click image/video to preview      │
│ 4. Change quantity/selection         │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Price Calculation Updated            │
│ - Gift service price added           │
│ - Subtotal recalculated              │
│ - Order total updated                │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Order Created                        │
│ - Gift services included in order    │
│ - Price and notes stored             │
│ - Order confirmation sent            │
└──────────────────────────────────────┘
```

## Data Flow Diagram

```
Backend ERP
│
├─ GET /api/v1/gift-boxes/active
│  └─ Returns: Array of gift boxes with id, name, priceUsd, imageUrl, videoUrl
│
└─ GET /api/v1/gift-cards/active
   └─ Returns: Gift card data with priceUsd, imageUrl, videoUrl

                    ▼

Checkout.vue
├─ loadGiftBoxes() ──► giftBoxes.value = [...]
├─ loadGiftCardData() ──► giftCardImage.value, giftCardVideo.value
│
└─ GiftServiceSelector (per item)
   ├─ Display options
   ├─ Handle selection
   ├─ Store in itemGiftSelections
   ├─ Store notes in itemGiftNotes
   │
   └─ Price calculation
      └─ getGiftServicePriceForItem(item)

                    ▼

Order Creation
├─ giftBoxId: number (for BOX selection)
├─ giftNote: string (personal message)
│
└─ Order Totals
   ├─ Subtotal: cart items price
   ├─ Gift Services: +$X.XX
   ├─ Shipping: $0-$10
   └─ Total: final amount
```

## Component Lifecycle

```
Component Mount
     │
     ▼
loadGiftBoxes()  ─────┬──► axios.get('/gift-boxes/active')
                      │   
                      └──► giftBoxes.value = response.data
     │
     ├──► Render GiftServiceSelector for each item
     │
     ▼
User Interaction
     │
     ├─ Select option  ──► onGiftServiceChange()  ──► itemGiftSelections updated
     ├─ Add note       ──► @update:giftNote       ──► itemGiftNotes updated  
     ├─ Click media    ──► openMediaModal()       ──► Preview shown
     │
     ▼
Price Update
     │
     └──► getGiftServicePriceForItem() ──► giftServicesTotal recomputed
                                             │
                                             └──► Order summary updated
     │
     ▼
Order Submit
     │
     └──► createOrder() with gift data
          ├─ For CARD: giftNote = "Gift Card Service (+$5.00 per item) | message"
          └─ For BOX: giftBoxId + giftNote
```

## Media Modal Example

```
┌─────────────────────────────────────────────────────┐
│ × Gift Card                                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│                    [FULL SIZE IMAGE]               │
│                    or                              │
│                  [VIDEO PLAYER]                    │
│                  [Play] [Fullscreen]              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Gift Card                                          │
└─────────────────────────────────────────────────────┘
```

## API Response Examples

### Gift Boxes Response

```json
GET /api/v1/gift-boxes/active

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
  },
  {
    "id": 3,
    "name": "Luxury Gift Box",
    "description": "Premium box with velvet padding and ribbon",
    "priceUsd": 24.99,
    "imageUrl": "http://localhost:3000/uploads/gift-boxes/luxury.jpg",
    "videoUrl": "http://localhost:3000/uploads/gift-boxes/luxury-unboxing.mp4",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### Gift Card Response

```json
GET /api/v1/gift-cards/active

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

## Order Data Structure

### Order with Gift Services

```javascript
POST /api/v1/orders

{
  "userId": 1,
  "shippingAddress": "123 Main St, New York, NY 10001",
  "countryId": 1,
  "currencyId": 1,
  "notes": "Please leave at door",
  "items": [
    {
      "productId": 123,
      "quantity": 1,
      "giftBoxId": 1,                // Gift box ID (if BOX selected)
      "giftNote": "Happy Birthday!"  // Gift message
    },
    {
      "productId": 456,
      "quantity": 2,
      "giftNote": "Gift Card Service (+$5.00 per item) | Special message" // For CARD
    },
    {
      "productId": 789,
      "quantity": 1
      // No gift service for this item
    }
  ]
}
```

### Response

```json
{
  "id": 1001,
  "userId": 1,
  "items": [
    {
      "id": 5001,
      "productId": 123,
      "quantity": 1,
      "unitPriceAtTime": 99.99,
      "giftBoxId": 1,
      "giftNoteText": "Happy Birthday!"
    },
    {
      "id": 5002,
      "productId": 456,
      "quantity": 2,
      "unitPriceAtTime": 49.99,
      "giftBoxId": null,
      "giftNoteText": "Gift Card Service (+$5.00 per item) | Special message"
    }
  ],
  "totalUsdPrice": 224.97,
  "totalUsdPriceAfterDiscount": 214.97,
  "status": "ORDERED",
  "createdAt": "2024-01-20T15:30:00Z"
}
```

## State Management

### In Checkout Component

```javascript
// Gift Service State
ref({
  itemGiftSelections: {
    "1": "BOX:1",          // Item ID 1 selected Premium Box
    "2": "CARD",           // Item ID 2 selected Gift Card
    "3": ""                // Item ID 3 no service
  },
  
  itemGiftNotes: {
    "1": "Happy Birthday!",
    "2": "To my dear friend",
    "3": ""
  },
  
  giftBoxes: [
    { id: 1, name: "Premium Gift Box", priceUsd: 12.99, ... },
    { id: 2, name: "Standard Gift Box", priceUsd: 5.99, ... }
  ],
  
  giftCardImage: "http://...",
  giftCardVideo: "http://...",
  giftCardServicePrice: 5
})

// Computed
giftServicesTotal = 12.99 + 5 = $17.99
```

## Mobile Responsive Layout

```
Mobile (320px):
┌────────────────────────────┐
│   GIFT OPTIONS             │
├────────────────────────────┤
│ Item 1                     │
│ ┌────────────────────────┐ │
│ │ ☐ No Additional   Free │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ ◉ Gift Card      +$5   │ │
│ │ [Image]                │ │
│ │ [Video]                │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ ☐ Premium       +$13   │ │
│ │ [Image]                │ │
│ └────────────────────────┘ │
│                            │
│ Gift Note                  │
│ [Enter message...]         │
└────────────────────────────┘

Tablet (768px):
┌───────────────────────────────────────────┐
│            GIFT OPTIONS                   │
├───────────────────────────────────────────┤
│ Item 1                                    │
│ ┌──────────────────────────────────────┐ │
│ │ ☐ No Service  ◉ Gift Card  ☐ Premium│ │
│ │        +$0         +$5        +$13   │ │
│ │ [Images shown side by side]         │ │
│ └──────────────────────────────────────┘ │
│ Gift Note: [Personal message...]        │
└───────────────────────────────────────────┘

Desktop (1024px):
┌─────────────────────────────────────────────────┐
│            GIFT OPTIONS                         │
├─────────────────────────────────────────────────┤
│ Item 1: Diamond Necklace                        │
│ ┌──────────────────────────────────────────┐   │
│ │☐ No Service  ◉ Gift Card  ☐ Premium Box │   │
│ │     +$0         +$5            +$12.99   │   │
│ │ [Image]      [Image/Video]    [Image]    │   │
│ └──────────────────────────────────────────┘   │
│ Gift Note: [Personal message...]              │
└─────────────────────────────────────────────────┘
```

## Event Flow

```
User Click
    │
    ▼
Vue Radio Button Change
    │
    ▼
@change="onGiftServiceChange()"
    │
    ▼
itemGiftSelections updated
    │
    ├─► getGiftServicePriceForItem() recalculated
    ├─► giftServicesTotal recomputed
    ├─► totalWithShipping recomputed
    │
    ▼
DOM Re-render
    │
    ├─► Order summary updated
    └─► Price displayed to user
```

## Color Scheme

```
Component Colors:
├─ Border: #e0e0e0 (light gray)
├─ Border Hover: #000 (black)
├─ Text Title: #333 (dark)
├─ Text Description: #666 (medium gray)
├─ Price: #28a745 (green)
├─ Background: #f9f9f9 (very light gray)
├─ Modal Overlay: rgba(0, 0, 0, 0.7) (dark overlay)
└─ Focus: #000 with box-shadow

Bootstrap Classes Used:
├─ d-flex (display: flex)
├─ justify-content-between
├─ align-items-center
├─ gap-2, gap-3 (spacing)
├─ mt-2, mt-3 (margin-top)
├─ mb-3 (margin-bottom)
├─ fw-600 (font-weight: 600)
└─ text-center
```

This visual guide helps understand the complete flow of the GiftBox and GiftCard implementation!

