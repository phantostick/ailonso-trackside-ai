import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MerchItem {
  id: string;
  name: string;
  basePrice: number;
  category: 'tshirt' | 'hoodie' | 'cap' | 'jacket';
  description: string;
}

interface CustomizationOptions {
  color: 'green' | 'yellow' | 'black' | 'white';
  customName: string;
  customNumber: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
}

const MERCH_ITEMS: MerchItem[] = [
  {
    id: 'tshirt-1',
    name: 'AMF1 Racing T-Shirt',
    basePrice: 29.99,
    category: 'tshirt',
    description: 'Premium cotton racing tee with AMF1 branding'
  },
  {
    id: 'hoodie-1',
    name: 'AMF1 Team Hoodie',
    basePrice: 59.99,
    category: 'hoodie',
    description: 'Cozy team hoodie with racing stripes'
  },
  {
    id: 'cap-1',
    name: 'AMF1 Racing Cap',
    basePrice: 24.99,
    category: 'cap',
    description: 'Adjustable cap with embroidered logo'
  },
  {
    id: 'jacket-1',
    name: 'AMF1 Racing Jacket',
    basePrice: 89.99,
    category: 'jacket',
    description: 'Weather-resistant team jacket'
  }
];

const COLOR_OPTIONS = [
  { value: 'green', name: 'AMF1 Green', class: 'bg-primary' },
  { value: 'yellow', name: 'Racing Yellow', class: 'bg-accent' },
  { value: 'black', name: 'Stealth Black', class: 'bg-gray-900' },
  { value: 'white', name: 'Pure White', class: 'bg-gray-100 border' }
];

export default function MerchPage() {
  const [selectedItem, setSelectedItem] = useState<MerchItem>(MERCH_ITEMS[0]);
  const [customization, setCustomization] = useState<CustomizationOptions>({
    color: 'green',
    customName: '',
    customNumber: '',
    size: 'M'
  });
  const [cart, setCart] = useState<any[]>([]);

  const calculatePrice = () => {
    let price = selectedItem.basePrice;
    if (customization.customName) price += 5;
    if (customization.customNumber) price += 3;
    return price;
  };

  const addToCart = () => {
    const cartItem = {
      id: Date.now().toString(),
      item: selectedItem,
      customization: { ...customization },
      price: calculatePrice()
    };
    setCart(prev => [...prev, cartItem]);
    
    // Toast notification would go here
    console.log('Added to cart:', cartItem);
  };

  const getMerchIcon = (category: string) => {
    switch (category) {
      case 'tshirt': return '👕';
      case 'hoodie': return '🧥';
      case 'cap': return '🧢';
      case 'jacket': return '🧥';
      default: return '👕';
    }
  };

  const getColorPreview = (color: string) => {
    switch (color) {
      case 'green': return 'hsl(var(--primary))';
      case 'yellow': return '#f8cd02'; 
      case 'black': return '#000000';
      case 'white': return '#ffffff';
      default: return 'hsl(var(--primary))';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="racing-title text-4xl mb-4">Style Studio</h1>
        <p className="text-muted-foreground text-lg">
          Alonso guided outfitting: fans answer a few quick prompts and get smart bundles—jerseys, caps, layers—optimized for the event's weather and circuit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="space-y-6">
          <div className="racing-card p-5">
            <h3 className="racing-subtitle mb-4">Choose Your Item</h3>
            <div className="space-y-3">
              {MERCH_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all duration-200",
                    "hover:border-primary/50 hover:bg-secondary/50",
                    selectedItem.id === item.id 
                      ? "border-primary bg-primary/10" 
                      : "border-border"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getMerchIcon(item.category)}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                      <div className="text-sm font-semibold text-accent mt-1">
                        ${item.basePrice}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="racing-card p-5">
            <h3 className="racing-subtitle mb-4">
              Cart ({cart.length})
            </h3>
            {cart.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <div className="text-2xl mb-2">🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{item.item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.customization.color} • {item.customization.size}
                      </div>
                    </div>
                    <div className="font-semibold">${item.price.toFixed(2)}</div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-accent">
                      ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customization */}
        <div className="racing-card p-6">
          <h3 className="racing-subtitle mb-6">Customize Your {selectedItem.name}</h3>

          <div className="space-y-6">
            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">Color Scheme</label>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setCustomization(prev => ({ ...prev, color: color.value as any }))}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200",
                      "hover:border-primary/50",
                      customization.color === color.value 
                        ? "border-primary bg-primary/10" 
                        : "border-border"
                    )}
                  >
                    <div className={cn("w-4 h-4 rounded-full", color.class)}></div>
                    <span className="text-sm font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">Size</label>
              <select
                value={customization.size}
                onChange={(e) => setCustomization(prev => ({ ...prev, size: e.target.value as any }))}
                className="racing-select w-full"
              >
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {/* Custom Name */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Custom Name (+$5.00)
              </label>
              <input
                type="text"
                value={customization.customName}
                onChange={(e) => setCustomization(prev => ({ ...prev, customName: e.target.value }))}
                placeholder="Enter your name"
                className="racing-select w-full"
                maxLength={20}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Max 20 characters
              </div>
            </div>

            {/* Custom Number */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Racing Number (+$3.00)
              </label>
              <input
                type="text"
                value={customization.customNumber}
                onChange={(e) => setCustomization(prev => ({ ...prev, customNumber: e.target.value.replace(/\D/g, '') }))}
                placeholder="Enter number (1-99)"
                className="racing-select w-full"
                maxLength={2}
              />
              <div className="text-xs text-muted-foreground mt-1">
                Numbers 1-99 only
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total Price:</span>
                <span className="text-2xl font-bold text-accent">${calculatePrice().toFixed(2)}</span>
              </div>
              
              <button
                onClick={addToCart}
                className="racing-button-primary w-full py-3 text-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="racing-card p-6">
          <h3 className="racing-subtitle mb-6">Live Preview</h3>
          
          <div className="text-center">
            {/* Mock Product Visualization */}
            <div 
              className="w-48 h-48 mx-auto rounded-2xl flex items-center justify-center text-6xl mb-4 relative overflow-hidden"
              style={{ backgroundColor: getColorPreview(customization.color) }}
            >
              <div className={cn(
                "text-6xl",
                customization.color === 'white' ? 'text-gray-800' : 'text-white'
              )}>
                {getMerchIcon(selectedItem.category)}
              </div>
              
              {/* AMF1 Logo */}
              <div className={cn(
                "absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded",
                customization.color === 'white' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/20 text-white'
              )}>
                AMF1
              </div>

              {/* Custom Name */}
              {customization.customName && (
                <div className={cn(
                  "absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-bold",
                  customization.color === 'white' ? 'text-gray-800' : 'text-white'
                )}>
                  {customization.customName.toUpperCase()}
                </div>
              )}

              {/* Racing Number */}
              {customization.customNumber && (
                <div className={cn(
                  "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  customization.color === 'white' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-white/20 text-white'
                )}>
                  {customization.customNumber}
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div><strong>Item:</strong> {selectedItem.name}</div>
              <div><strong>Color:</strong> {COLOR_OPTIONS.find(c => c.value === customization.color)?.name}</div>
              <div><strong>Size:</strong> {customization.size}</div>
              {customization.customName && (
                <div><strong>Name:</strong> {customization.customName}</div>
              )}
              {customization.customNumber && (
                <div><strong>Number:</strong> #{customization.customNumber}</div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-3">Premium Features</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Premium materials</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Official AMF1 branding</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>Machine washable</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✓</span>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
