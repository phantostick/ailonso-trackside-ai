import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ShoppingCart, Star, Heart, X, Palette, Upload, Type, Save, Box } from 'lucide-react';
import Product3DViewer from '@/components/Product3DViewerWithGLTF';

interface MerchItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'apparel' | 'accessories' | 'collectibles' | 'gear';
  subcategory: string;
  description: string;
  image: string; // Product image URL (can be real photo or emoji for now)
  model3D?: string; // Optional path to GLB/GLTF 3D model file
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
  sizes?: string[];
  colors?: string[];
}

interface CartItem extends MerchItem {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  customization?: CustomizationData;
}

interface CustomizationData {
  customText?: string;
  customNumber?: string;
  selectedColor?: string;
  selectedSize?: string;
  uploadedLogo?: string;
  logoPosition?: 'front' | 'back' | 'sleeve';
}

const MERCH_ITEMS: MerchItem[] = [
  // Apparel - T-Shirts
  {
    id: 'tshirt-1',
    name: 'AMF1 Racing Team T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    category: 'apparel',
    subcategory: 'T-Shirts',
    description: 'Premium cotton racing tee with official AMF1 team branding and Aston Martin logo',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dwa163ea68/images/large/701233031002_pp_01_astonmartinf1.jpg?sw=1316&q=80',
    model3D: undefined,
    rating: 4.8,
    reviews: 156,
    inStock: true,
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Green', 'Black', 'White']
  },
  {
    id: 'tshirt-2',
    name: 'Fernando Alonso Signature T-Shirt',
    price: 34.99,
    category: 'apparel',
    subcategory: 'T-Shirts',
    description: 'Exclusive Fernando Alonso signature tee with #14 racing number',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw10ee0973/images/large/701228842001_pp_01_astonmartinf1.jpg?sw=1316&q=80',
    model3D: undefined,
    rating: 4.9,
    reviews: 203,
    inStock: true,
    featured: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Green', 'Yellow', 'Black']
  },

  // Apparel - Hoodies
  {
    id: 'hoodie-1',
    name: 'AMF1 Team Performance Hoodie',
    price: 59.99,
    originalPrice: 79.99,
    category: 'apparel',
    subcategory: 'Hoodies',
    description: 'Premium team hoodie with moisture-wicking fabric and racing stripes',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dwa191391e/images/large/701228839001_pp_01_astonmartinf1.jpg?sw=1316&q=80',
    model3D: undefined,
    rating: 4.9,
    reviews: 178,
    inStock: true,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Green', 'Black']
  },
  {
    id: 'hoodie-2',
    name: 'Paddock Club Zip Hoodie',
    price: 64.99,
    category: 'apparel',
    subcategory: 'Hoodies',
    description: 'Full-zip hoodie with embroidered AMF1 logo and sponsor details',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw6cce99ab/images/large/701228839002_pp_01_astonmartinf1.jpg?sw=1316&q=80',
    model3D: undefined,
    rating: 4.7,
    reviews: 134,
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Green', 'Black', 'Grey']
  },

  // Accessories - Headwear
  {
    id: 'cap-1',
    name: 'AMF1 Racing Cap - Green',
    price: 24.99,
    category: 'accessories',
    subcategory: 'Headwear',
    description: 'Adjustable snapback cap with embroidered AMF1 logo in team green',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dwde9a909d/images/large/701233022001_pp_01_astonmartinf1.jpg?sw=1316&q=80',
    model3D: undefined,
    rating: 4.8,
    reviews: 312,
    inStock: true,
    featured: true,
    colors: ['Green', 'Black', 'White']
  },
  {
    id: 'cap-2',
    name: 'Fernando Alonso Driver Cap - Dark',
    price: 29.99,
    category: 'accessories',
    subcategory: 'Headwear',
    description: 'Official driver cap with #14 and signature in dark colorway',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dwc0b6f354/images/large/701233022002_pp_01_astonmartinf1.jpg?sw=800&sh=800&sm=fit',
    model3D: undefined,
    rating: 4.9,
    reviews: 298,
    inStock: true,
    colors: ['Green', 'Black']
  },

  // Accessories - Drinkware
  {
    id: 'bottle-1',
    name: 'AMF1 Team Water Bottle',
    price: 14.99,
    category: 'accessories',
    subcategory: 'Drinkware',
    description: 'Insulated stainless steel water bottle with team colors and AMF1 branding',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw8e586982/images/large/701228844001_pp_01_AstonMartinF1Team.jpg?sw=1316&q=80',
    model3D: undefined,
    rating: 4.5,
    reviews: 201,
    inStock: true,
    colors: ['Green', 'Silver']
  },

  // Collectibles - Models & Toys
  {
    id: 'model-1',
    name: 'LEGO Speed Champions AMF1 Car',
    price: 79.99,
    category: 'collectibles',
    subcategory: 'Models',
    description: 'Highly detailed LEGO Speed Champions model of the AMF1 car - perfect for collectors',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw8685eb42/images/large/701239089001_pp_01_pp_01_legospeedchampion.jpg?sw=1316&q=80',
    model3D: undefined,
    rating: 4.9,
    reviews: 89,
    inStock: true,
    featured: true
  },

  // Gear - Safety & Accessories
  {
    id: 'helmet-1',
    name: 'Fernando Alonso Replica Helmet',
    price: 199.99,
    originalPrice: 249.99,
    category: 'gear',
    subcategory: 'Safety',
    description: 'Official Fernando Alonso replica helmet with authentic design and colors',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dwc5e2f20c/images/large/701241565001_pp_01_Alonso.png?sw=1316&q=80',
    model3D: undefined,
    rating: 5.0,
    reviews: 45,
    inStock: true,
    featured: true,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'umbrella-1',
    name: 'AMF1 Team Golf Umbrella',
    price: 34.99,
    category: 'gear',
    subcategory: 'Accessories',
    description: 'Large golf umbrella with official AMF1 team branding - perfect for race day weather',
    image: 'https://shop.astonmartinf1.com/dw/image/v2/BDWJ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw2f3db31e/images/large/701229265001_pp_01_AstonMartinF1.jpg?sw=1316&q=80',
    model3D: undefined,
    rating: 4.7,
    reviews: 76,
    inStock: true
  }
];

// Helper function to determine 3D model type from product
const getProductType = (product: MerchItem): 'tshirt' | 'hoodie' | 'cap' | 'jacket' | 'helmet' | 'car' | 'other' => {
  const name = product.name.toLowerCase();
  const category = product.subcategory.toLowerCase();

  if (name.includes('t-shirt') || name.includes('tee')) return 'tshirt';
  if (name.includes('hoodie') || name.includes('sweatshirt')) return 'hoodie';
  if (name.includes('cap') || name.includes('hat') || category.includes('headwear')) return 'cap';
  if (name.includes('jacket') || name.includes('windbreaker')) return 'jacket';
  if (name.includes('helmet')) return 'helmet';
  if (name.includes('lego') || name.includes('car') || name.includes('diecast')) return 'car';

  return 'other';
};

// Helper to convert color names to hex
const colorNameToHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'green': '#00594F',
    'black': '#000000',
    'white': '#FFFFFF',
    'grey': '#808080',
    'gray': '#808080',
    'yellow': '#FFD700',
    'red': '#DC0000',
    'blue': '#0000FF',
    'silver': '#C0C0C0',
    'navy': '#000080',
  };
  
  return colorMap[colorName.toLowerCase()] || '#00594F';
};

export default function MerchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MerchItem | null>(null);
  const [customizeProduct, setCustomizeProduct] = useState<MerchItem | null>(null);
  const [customization, setCustomization] = useState<CustomizationData>({
    customText: '',
    customNumber: '',
    selectedColor: '',
    selectedSize: '',
    uploadedLogo: '',
    logoPosition: 'front'
  });
  const [savedCustomizations, setSavedCustomizations] = useState<Array<{product: MerchItem, customization: CustomizationData}>>([]);
  const [view3DProduct, setView3DProduct] = useState<MerchItem | null>(null);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = MERCH_ITEMS.filter(item => {
      // Search filter
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.reviews - a.reviews;
        case 'featured':
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [searchQuery, sortBy]);

  const addToCart = (product: MerchItem, size?: string, color?: string, customizationData?: CustomizationData) => {
    const existingItem = cart.find(item => 
      item.id === product.id && 
      item.selectedSize === size && 
      item.selectedColor === color &&
      JSON.stringify(item.customization) === JSON.stringify(customizationData)
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor === color &&
        JSON.stringify(item.customization) === JSON.stringify(customizationData)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedSize: size, selectedColor: color, customization: customizationData }]);
    }
  };

  const openCustomizeModal = (product: MerchItem) => {
    setCustomizeProduct(product);
    setCustomization({
      customText: '',
      customNumber: '',
      selectedColor: product.colors?.[0] || '',
      selectedSize: product.sizes?.[0] || '',
      uploadedLogo: '',
      logoPosition: 'front'
    });
  };

  const closeCustomizeModal = () => {
    setCustomizeProduct(null);
    setCustomization({
      customText: '',
      customNumber: '',
      selectedColor: '',
      selectedSize: '',
      uploadedLogo: '',
      logoPosition: 'front'
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomization(prev => ({
          ...prev,
          uploadedLogo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCustomization = () => {
    if (customizeProduct) {
      setSavedCustomizations([...savedCustomizations, {
        product: customizeProduct,
        customization: { ...customization }
      }]);
      alert('Customization saved! You can view it in your saved designs.');
      closeCustomizeModal();
    }
  };

  const addCustomizedToCart = () => {
    if (customizeProduct) {
      addToCart(
        customizeProduct,
        customization.selectedSize,
        customization.selectedColor,
        { ...customization }
      );
      closeCustomizeModal();
    }
  };

  const getCustomizationPrice = () => {
    let additionalPrice = 0;
    if (customization.customText) additionalPrice += 5;
    if (customization.customNumber) additionalPrice += 3;
    if (customization.uploadedLogo) additionalPrice += 10;
    return additionalPrice;
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart(cart.filter(item => 
      !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      setCart(cart.map(item =>
        item.id === productId && 
        item.selectedSize === size && 
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const getItemPrice = (item: CartItem) => {
    let price = item.price;
    if (item.customization) {
      if (item.customization.customText) price += 5;
      if (item.customization.customNumber) price += 3;
      if (item.customization.uploadedLogo) price += 10;
    }
    return price;
  };

  const cartTotal = cart.reduce((total, item) => total + (getItemPrice(item) * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="racing-title text-3xl mb-1">AMF1 Team Store</h1>
              <p className="text-sm text-muted-foreground">Official Aston Martin F1 Merchandise</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="relative">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="default" className="relative">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart
                    {cartItemCount > 0 && (
                      <Badge className="ml-2 bg-accent text-accent-foreground">
                        {cartItemCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Shopping Cart ({cartItemCount} items)</SheetTitle>
                    <SheetDescription>
                      Review your items before checkout
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-8 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        {cart.map((item, index) => (
                          <Card key={`${item.id}-${index}`}>
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="w-20 h-20 flex-shrink-0 bg-secondary/30 rounded-lg overflow-hidden">
                                  {item.image.startsWith('http') ? (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/80x80/00594F/FFFFFF?text=AMF1';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl">
                                      {item.image}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                    {item.selectedSize && <div>Size: {item.selectedSize}</div>}
                                    {item.selectedColor && <div>Color: {item.selectedColor}</div>}
                                    {item.customization?.customText && (
                                      <div className="flex items-center gap-1">
                                        <Type className="h-3 w-3" />
                                        <span>Text: {item.customization.customText}</span>
                                      </div>
                                    )}
                                    {item.customization?.customNumber && (
                                      <div>Number: #{item.customization.customNumber}</div>
                                    )}
                                    {item.customization?.uploadedLogo && (
                                      <div className="flex items-center gap-1">
                                        <Palette className="h-3 w-3" />
                                        <span>Custom Logo ({item.customization.logoPosition})</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                                      >
                                        -
                                      </Button>
                                      <span className="w-8 text-center">{item.quantity}</span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                                      >
                                        +
                                      </Button>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-bold">${(getItemPrice(item) * item.quantity).toFixed(2)}</div>
                                      {item.customization && (
                                        <div className="text-xs text-muted-foreground">
                                          (${item.price.toFixed(2)} + customization)
                                        </div>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-destructive h-6 px-2"
                                        onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <div className="border-t pt-4 mt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                          </div>
                          <Button className="w-full" size="lg">
                            Proceed to Checkout
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Sort Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                <strong>{filteredProducts.length}</strong> products
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div>
          {/* Featured Products Banner */}
          {sortBy === 'featured' && filteredProducts.some(p => p.featured) && (
            <div className="mb-6 p-4 bg-primary/5 border-l-4 border-primary rounded">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-primary fill-primary" />
                <h3 className="font-semibold">Featured Items</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Check out our hand-picked collection of premium AMF1 merchandise
              </p>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search query
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={cn(
                      "overflow-hidden transition-all duration-200 hover:shadow-lg",
                      product.featured && "border-primary/50"
                    )}
                  >
                    <CardHeader className="pb-4">
                      <div className="relative">
                        {/* Product Image */}
                        <div className="w-full h-48 bg-secondary/30 rounded-lg overflow-hidden mb-3">
                          {product.image.startsWith('http') ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/400x400/00594F/FFFFFF?text=AMF1';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                              {product.image}
                            </div>
                          )}
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex gap-2">
                          {product.featured && (
                            <Badge className="bg-primary">Featured</Badge>
                          )}
                          {product.originalPrice && (
                            <Badge variant="destructive">Sale</Badge>
                          )}
                          {!product.inStock && (
                            <Badge variant="secondary">Out of Stock</Badge>
                          )}
                        </div>
                        
                        {/* Wishlist Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart
                            className={cn(
                              "h-5 w-5",
                              wishlist.includes(product.id) && "fill-red-500 text-red-500"
                            )}
                          />
                        </Button>
                      </div>
                      
                      <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="pb-4">
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Colors & Sizes */}
                      {/* <div className="space-y-2 mb-4">
                        {product.colors && product.colors.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Colors: {product.colors.join(', ')}
                          </div>
                        )}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Sizes: {product.sizes.join(', ')}
                          </div>
                        )}
                      </div> */}
                    </CardContent>
                    
                    <CardFooter className="pt-0 flex-col">
                      <div className="flex w-full">
                        <Button
                          className="flex-1"
                          disabled={!product.inStock}
                          onClick={() => {
                            setSelectedProduct(product);
                            if (!product.sizes && !product.colors) {
                              addToCart(product);
                            }
                          }}
                        >
                          <ShoppingCart className="h-4 w-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          disabled={!product.inStock}
                          onClick={() => setView3DProduct(product)}
                        >
                          <Box className="h-4 w-3" />
                          Custiomize
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (selectedProduct.sizes || selectedProduct.colors) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedProduct.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedProduct.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProduct(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-full h-64 bg-secondary/30 rounded-lg overflow-hidden mb-4">
                    {selectedProduct.image.startsWith('http') ? (
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x400/00594F/FFFFFF?text=AMF1';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl">
                        {selectedProduct.image}
                      </div>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ${selectedProduct.price.toFixed(2)}
                  </div>
                </div>
                
                {selectedProduct.sizes && (
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Select Size</label>
                    <div className="grid grid-cols-6 gap-2">
                      {selectedProduct.sizes.map(size => (
                        <Button key={size} variant="outline" className="w-full">
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedProduct.colors && (
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Select Color</label>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedProduct.colors.map(color => (
                        <Button key={color} variant="outline" className="w-full">
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customization Modal */}
      <Dialog open={!!customizeProduct} onOpenChange={(open) => !open && closeCustomizeModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Customize Your {customizeProduct?.name}
            </DialogTitle>
            <DialogDescription>
              Personalize your merchandise with custom text, numbers, and logos
            </DialogDescription>
          </DialogHeader>

          {customizeProduct && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
              {/* Customization Options */}
              <div className="space-y-6">
                <Tabs defaultValue="basics" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basics">Basics</TabsTrigger>
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="logo">Logo</TabsTrigger>
                  </TabsList>

                  {/* Basics Tab */}
                  <TabsContent value="basics" className="space-y-4 mt-4">
                    {customizeProduct.colors && customizeProduct.colors.length > 0 && (
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Select Color</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {customizeProduct.colors.map(color => (
                            <Button
                              key={color}
                              variant={customization.selectedColor === color ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => setCustomization(prev => ({ ...prev, selectedColor: color }))}
                            >
                              {color}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {customizeProduct.sizes && customizeProduct.sizes.length > 0 && (
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Select Size</Label>
                        <div className="grid grid-cols-6 gap-2">
                          {customizeProduct.sizes.map(size => (
                            <Button
                              key={size}
                              variant={customization.selectedSize === size ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => setCustomization(prev => ({ ...prev, selectedSize: size }))}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Text Tab */}
                  <TabsContent value="text" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="customText" className="text-base font-semibold mb-2 flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Custom Text (+$5.00)
                      </Label>
                      <Input
                        id="customText"
                        placeholder="Enter your name or custom text"
                        value={customization.customText}
                        onChange={(e) => setCustomization(prev => ({ ...prev, customText: e.target.value }))}
                        maxLength={20}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Max 20 characters
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="customNumber" className="text-base font-semibold mb-2 block">
                        Racing Number (+$3.00)
                      </Label>
                      <Input
                        id="customNumber"
                        placeholder="Enter number (1-99)"
                        value={customization.customNumber}
                        onChange={(e) => setCustomization(prev => ({ 
                          ...prev, 
                          customNumber: e.target.value.replace(/\D/g, '').slice(0, 2) 
                        }))}
                        maxLength={2}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Numbers 1-99 only
                      </p>
                    </div>
                  </TabsContent>

                  {/* Logo Tab */}
                  <TabsContent value="logo" className="space-y-4 mt-4">
                    <div>
                      <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Custom Logo (+$10.00)
                      </Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        {customization.uploadedLogo ? (
                          <div className="space-y-3">
                            <img 
                              src={customization.uploadedLogo} 
                              alt="Uploaded logo" 
                              className="max-h-32 mx-auto rounded"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCustomization(prev => ({ ...prev, uploadedLogo: '' }))}
                            >
                              Remove Logo
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground mb-3">
                              Upload your logo or image
                            </p>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="max-w-xs mx-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {customization.uploadedLogo && (
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Logo Position</Label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['front', 'back', 'sleeve'] as const).map(position => (
                            <Button
                              key={position}
                              variant={customization.logoPosition === position ? 'default' : 'outline'}
                              onClick={() => setCustomization(prev => ({ ...prev, logoPosition: position }))}
                            >
                              {position.charAt(0).toUpperCase() + position.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Summary */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Customization Summary</h4>
                  <div className="space-y-1 text-sm">
                    {customization.selectedColor && (
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <span className="font-medium">{customization.selectedColor}</span>
                      </div>
                    )}
                    {customization.selectedSize && (
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span className="font-medium">{customization.selectedSize}</span>
                      </div>
                    )}
                    {customization.customText && (
                      <div className="flex justify-between">
                        <span>Custom Text:</span>
                        <span className="font-medium">{customization.customText}</span>
                      </div>
                    )}
                    {customization.customNumber && (
                      <div className="flex justify-between">
                        <span>Racing Number:</span>
                        <span className="font-medium">#{customization.customNumber}</span>
                      </div>
                    )}
                    {customization.uploadedLogo && (
                      <div className="flex justify-between">
                        <span>Custom Logo:</span>
                        <span className="font-medium">Yes ({customization.logoPosition})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-4">
                <div className="sticky top-0">
                  <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                  
                  {/* Product Preview */}
                  <div className="border rounded-lg p-6 bg-secondary/20">
                    <div 
                      className="w-full h-80 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden"
                      style={{ 
                        backgroundColor: customization.selectedColor 
                          ? `var(--${customization.selectedColor.toLowerCase()})` 
                          : '#f0f0f0' 
                      }}
                    >
                      {customizeProduct.image.startsWith('http') ? (
                        <img 
                          src={customizeProduct.image} 
                          alt={customizeProduct.name}
                          className="w-full h-full object-cover opacity-80"
                          style={{
                            filter: customization.selectedColor ? `sepia(1) saturate(3) hue-rotate(${customization.selectedColor === 'Green' ? '150deg' : customization.selectedColor === 'Black' ? '0deg' : '0deg'})` : 'none'
                          }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x400/00594F/FFFFFF?text=AMF1';
                          }}
                        />
                      ) : (
                        <div className="text-8xl opacity-80">
                          {customizeProduct.image}
                        </div>
                      )}

                      {/* AMF1 Logo */}
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded text-sm font-bold">
                        AMF1
                      </div>

                      {/* Custom Text */}
                      {customization.customText && (
                        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white/90 px-4 py-2 rounded font-bold text-lg">
                          {customization.customText.toUpperCase()}
                        </div>
                      )}

                      {/* Racing Number */}
                      {customization.customNumber && (
                        <div className="absolute top-4 right-4 bg-white/90 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                          {customization.customNumber}
                        </div>
                      )}

                      {/* Custom Logo */}
                      {customization.uploadedLogo && (
                        <div className={cn(
                          "absolute bg-white/90 p-2 rounded",
                          customization.logoPosition === 'front' && "bottom-4 left-1/2 transform -translate-x-1/2",
                          customization.logoPosition === 'back' && "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                          customization.logoPosition === 'sleeve' && "top-1/2 right-4 transform -translate-y-1/2"
                        )}>
                          <img 
                            src={customization.uploadedLogo} 
                            alt="Custom logo" 
                            className="h-16 w-16 object-contain"
                          />
                        </div>
                      )}
                    </div>

                    {/* Size indicator */}
                    {customization.selectedSize && (
                      <div className="text-center text-sm text-muted-foreground mb-2">
                        Size: <span className="font-semibold">{customization.selectedSize}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="border rounded-lg p-4 mt-4 bg-card">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span className="font-medium">${customizeProduct.price.toFixed(2)}</span>
                      </div>
                      {customization.customText && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Custom Text:</span>
                          <span>+$5.00</span>
                        </div>
                      )}
                      {customization.customNumber && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Racing Number:</span>
                          <span>+$3.00</span>
                        </div>
                      )}
                      {customization.uploadedLogo && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Custom Logo:</span>
                          <span>+$10.00</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">
                          ${(customizeProduct.price + getCustomizationPrice()).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={saveCustomization}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Design
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={addCustomizedToCart}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 3D Product Viewer & Customizer Modal */}
      <Dialog open={view3DProduct !== null} onOpenChange={(open) => !open && setView3DProduct(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {view3DProduct?.name} - 3D View & Customize
            </DialogTitle>
            <DialogDescription>
              Rotate the 3D model with your mouse. Customize colors, add text and logos below.
            </DialogDescription>
          </DialogHeader>
          
          {view3DProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left side - 3D Viewer */}
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100" style={{ height: '500px' }}>
                  <Product3DViewer
                    modelPath={view3DProduct.model3D}
                    productType={getProductType(view3DProduct)}
                    color={colorNameToHex(customization.selectedColor || view3DProduct.colors?.[0] || 'green')}
                    logoUrl={customization.uploadedLogo}
                    text={customization.customText || customization.customNumber}
                    autoRotate={true}
                  />
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  <p>🖱️ Click and drag to rotate • Scroll to zoom • Auto-rotating enabled</p>
                </div>
              </div>

              {/* Right side - Customization Controls */}
              <div className="space-y-4">
                <Tabs defaultValue="design" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="design">
                      <Palette className="h-4 w-4 mr-2" />
                      Design
                    </TabsTrigger>
                    <TabsTrigger value="text">
                      <Type className="h-4 w-4 mr-2" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="logo">
                      <Upload className="h-4 w-4 mr-2" />
                      Logo
                    </TabsTrigger>
                  </TabsList>

                  {/* Design Tab */}
                  <TabsContent value="design" className="space-y-4">
                    {/* Color Selection */}
                    {view3DProduct.colors && view3DProduct.colors.length > 0 && (
                      <div className="space-y-2">
                        <Label>Select Color</Label>
                        <div className="flex gap-2 flex-wrap">
                          {view3DProduct.colors.map((color) => (
                            <Button
                              key={color}
                              variant={customization.selectedColor === color ? "default" : "outline"}
                              onClick={() => setCustomization(prev => ({ ...prev, selectedColor: color }))}
                              className="flex items-center gap-2"
                            >
                              <div 
                                className="w-4 h-4 rounded-full border-2 border-white shadow"
                                style={{ backgroundColor: colorNameToHex(color) }}
                              />
                              {color}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Selection */}
                    {view3DProduct.sizes && view3DProduct.sizes.length > 0 && (
                      <div className="space-y-2">
                        <Label>Select Size</Label>
                        <div className="flex gap-2 flex-wrap">
                          {view3DProduct.sizes.map((size) => (
                            <Button
                              key={size}
                              variant={customization.selectedSize === size ? "default" : "outline"}
                              onClick={() => setCustomization(prev => ({ ...prev, selectedSize: size }))}
                              size="sm"
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Text Tab */}
                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customText">Custom Text (+$5.00)</Label>
                      <Input
                        id="customText"
                        placeholder="Enter your text (max 20 characters)"
                        value={customization.customText}
                        onChange={(e) => setCustomization(prev => ({ 
                          ...prev, 
                          customText: e.target.value.slice(0, 20) 
                        }))}
                        maxLength={20}
                      />
                      <p className="text-xs text-muted-foreground">
                        {customization.customText?.length || 0}/20 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customNumber">Racing Number (+$3.00)</Label>
                      <Input
                        id="customNumber"
                        type="text"
                        placeholder="Enter number (e.g., 14)"
                        value={customization.customNumber}
                        onChange={(e) => setCustomization(prev => ({ 
                          ...prev, 
                          customNumber: e.target.value.replace(/\D/g, '').slice(0, 2) 
                        }))}
                        maxLength={2}
                      />
                    </div>
                  </TabsContent>

                  {/* Logo Tab */}
                  <TabsContent value="logo" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="logoUpload">Upload Logo (+$10.00)</Label>
                      <Input
                        id="logoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Supported formats: PNG, JPG, SVG (max 5MB)
                      </p>
                    </div>

                    {customization.uploadedLogo && (
                      <div className="space-y-2">
                        <Label>Logo Preview</Label>
                        <div className="border rounded-lg p-4 bg-secondary/20">
                          <img 
                            src={customization.uploadedLogo} 
                            alt="Uploaded logo" 
                            className="h-24 w-24 object-contain mx-auto"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCustomization(prev => ({ ...prev, uploadedLogo: '' }))}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove Logo
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Price Summary */}
                <div className="border rounded-lg p-4 bg-card space-y-2">
                  <h3 className="font-semibold mb-2">Price Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span className="font-medium">${view3DProduct.price.toFixed(2)}</span>
                    </div>
                    {customization.customText && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Custom Text:</span>
                        <span>+$5.00</span>
                      </div>
                    )}
                    {customization.customNumber && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Racing Number:</span>
                        <span>+$3.00</span>
                      </div>
                    )}
                    {customization.uploadedLogo && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Custom Logo:</span>
                        <span>+$10.00</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">
                        ${(view3DProduct.price + getCustomizationPrice()).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (view3DProduct) {
                        setSavedCustomizations([...savedCustomizations, {
                          product: view3DProduct,
                          customization: { ...customization }
                        }]);
                        alert('3D Customization saved!');
                      }
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Design
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (view3DProduct) {
                        addToCart(
                          view3DProduct,
                          customization.selectedSize,
                          customization.selectedColor,
                          { ...customization }
                        );
                        setView3DProduct(null);
                        // Reset customization
                        setCustomization({
                          customText: '',
                          customNumber: '',
                          selectedColor: '',
                          selectedSize: '',
                          uploadedLogo: '',
                          logoPosition: 'front'
                        });
                      }
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
