# Adding Real 3D Models and Images to Your Merchandise Store

## 📦 Step 1: Prepare Your Assets

### For Product Images (2D)
1. **Create a folder**: `public/images/merch/`
2. **Add product photos**:
   - `tshirt-green.jpg`
   - `hoodie-black.jpg`
   - `cap-green.jpg`
   - etc.

### For 3D Models
1. **Create a folder**: `public/models/`
2. **Download 3D models** from these sources:

#### Free 3D Model Resources:
- **Sketchfab**: https://sketchfab.com/search?q=tshirt&type=models
  - Filter by "Downloadable" and "Free"
  - Look for `.glb` or `.gltf` formats
  
- **Free3D**: https://free3d.com/3d-models/clothing
  - Download t-shirts, hoodies, caps
  
- **Poly Pizza**: https://poly.pizza/
  - Search for clothing items
  
- **CGTrader Free**: https://www.cgtrader.com/free-3d-models/clothing
  - Free clothing models

#### Recommended Models to Search For:
- "t-shirt 3d model free download"
- "hoodie 3d model glb"
- "baseball cap 3d model"
- "racing jacket 3d model"

## 🎨 Step 2: Optimize Your 3D Models

### Using Blender (Free):
1. Install Blender: https://www.blender.org/download/
2. Open your downloaded model
3. **Simplify the mesh**:
   - Select model → Modifiers → Decimate
   - Set ratio to 0.5 (reduces polygons by 50%)
4. **Export as GLB**:
   - File → Export → glTF 2.0 (.glb/.gltf)
   - Select GLB format (single file)
   - Keep all default settings
   - Save to `public/models/`

### Online Converters:
- **GLTF Viewer**: https://gltf-viewer.donmccurdy.com/
- **Online 3D Converter**: https://products.aspose.app/3d/conversion

## 📝 Step 3: Update Your Product Data

Replace emoji images with real URLs in `MerchPage.tsx`:

```typescript
const MERCH_ITEMS: MerchItem[] = [
  {
    id: 'tshirt-1',
    name: 'AMF1 Racing Team T-Shirt',
    price: 29.99,
    category: 'apparel',
    subcategory: 'T-Shirts',
    description: 'Premium cotton racing tee',
    image: '/images/merch/tshirt-green.jpg',  // ← Real image path
    model3D: '/models/tshirt.glb',            // ← 3D model path
    rating: 4.8,
    reviews: 156,
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Green', 'Black', 'White']
  },
  // ... more items
];
```

## 🔧 Step 4: Quick Start with Placeholder Images

If you don't have images yet, use placeholder services:

```typescript
// Using placeholder.com
image: 'https://via.placeholder.com/400x400/00594F/FFFFFF?text=AMF1+T-Shirt'

// Using Lorem Picsum (random images)
image: 'https://picsum.photos/400/400?random=1'

// Using Unsplash (high quality)
image: 'https://source.unsplash.com/400x400/?tshirt,racing'
```

## 🎯 Step 5: Example with Real Images

Here are some example URLs you can use right now:

```typescript
const MERCH_ITEMS: MerchItem[] = [
  {
    id: 'tshirt-1',
    name: 'AMF1 Racing Team T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    model3D: undefined, // Will use procedural 3D model
    // ... rest of properties
  },
  {
    id: 'hoodie-1',
    name: 'AMF1 Team Hoodie',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    model3D: undefined,
    // ... rest of properties
  },
  {
    id: 'cap-1',
    name: 'AMF1 Racing Cap',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
    model3D: undefined,
    // ... rest of properties
  }
];
```

## 🚀 Step 6: Using Custom 3D Models

Once you have `.glb` files in `public/models/`:

```typescript
{
  id: 'tshirt-1',
  name: 'AMF1 Racing Team T-Shirt',
  image: '/images/merch/tshirt-green.jpg',
  model3D: '/models/racing-tshirt.glb',  // Your custom model
  // ...
}
```

The viewer will automatically:
- Load your custom GLB model
- Apply the selected color
- Add customization (text, logos)
- Enable 360° rotation

## 📊 File Structure

```
public/
├── images/
│   └── merch/
│       ├── tshirt-green.jpg
│       ├── tshirt-black.jpg
│       ├── hoodie-green.jpg
│       ├── cap-green.jpg
│       └── jacket-amf1.jpg
│
└── models/
    ├── tshirt.glb          (500KB - 2MB ideal)
    ├── hoodie.glb
    ├── cap.glb
    └── jacket.glb
```

## ⚡ Performance Tips

1. **Optimize images**:
   - Max size: 800x800px
   - Format: WebP or JPG
   - Compress using: https://tinypng.com/

2. **Optimize 3D models**:
   - Max polygons: 10,000 per model
   - Single material preferred
   - File size: < 2MB per model

3. **Lazy loading**: Images and 3D models load on-demand automatically

## 🎨 Aston Martin F1 Green Color

Official Aston Martin Racing Green:
- Hex: `#00594F`
- RGB: `rgb(0, 89, 79)`

Use this in your product colors for brand consistency!

## 🔗 Quick Links

- **3D Model Tutorial**: https://www.youtube.com/watch?v=vrIiMuJzp8g
- **GLB Validator**: https://github.khronos.org/glTF-Validator/
- **3D Viewer Test**: https://gltf-viewer.donmccurdy.com/

---

Need help? The 3D viewer will automatically fall back to procedural models if no custom model is provided!
