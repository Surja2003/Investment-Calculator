# Mobile Simulator Guide

## Overview
This development tool provides a comprehensive mobile device simulator to help test and optimize the UI/UX of the Investment Calculator for various mobile devices.

## How to Access

### Enable Simulator
1. **Development Mode**: The simulator is only available in development mode
2. **Toggle Button**: Look for the "📱 Dev" button in the top-right corner of the application
3. **Click to Enable**: Click the toggle to open the device simulator panel

## Device Presets

### Available Devices
- **iPhone 14 Pro**: 393×852px - Latest iPhone with Dynamic Island
- **iPhone 13**: 390×844px - Popular iPhone model 
- **Samsung Galaxy S24 FE**: 384×854px - Target device for optimization
- **Google Pixel 7**: 412×915px - Android flagship
- **OnePlus 9**: 384×854px - Popular Android device
- **iPhone SE**: 375×667px - Compact iPhone
- **Samsung Galaxy A54**: 360×800px - Mid-range Android

### Custom Dimensions
- **Width**: Adjustable from 320px to 500px
- **Height**: Adjustable from 568px to 1000px
- **Real-time Preview**: Changes apply immediately

## Using the Simulator

### Testing Workflow
1. **Enable Simulator**: Click the "📱 Dev" toggle button
2. **Select Device**: Choose from preset devices or set custom dimensions
3. **Navigate**: Use the calculator normally within the simulated viewport
4. **Test All Features**: 
   - Input field interactions
   - Button taps and gestures
   - Scroll behavior
   - Layout responsiveness

### Key Testing Areas
- **SIP Calculator**: Monthly investment and duration inputs
- **Lumpsum Calculator**: Initial investment and timeline fields
- **SWP Calculator**: Withdrawal rate, expected return, period inputs
- **Goal Calculator**: Target amount and timeline fields

## Mobile Optimization Targets

### Samsung Galaxy S24 FE Specifications
- **Screen Size**: 6.7 inches
- **Resolution**: 1080×2340px
- **Viewport**: ~384×854px (accounting for browser chrome)
- **Touch Target**: Minimum 44×44px recommended
- **Font Size**: Minimum 16px for readability

### Responsive Breakpoints
- **xs**: 0px-599px (Mobile phones)
- **sm**: 600px-959px (Tablets)
- **md**: 960px+ (Desktop)

## Common Mobile Issues to Test

### Input Fields
- ✅ **Proper sizing**: Not too wide or narrow
- ✅ **Touch targets**: Easy to tap accurately  
- ✅ **Label alignment**: "%" and "yrs" properly positioned
- ✅ **Keyboard navigation**: Smooth input experience

### Layout Issues
- ✅ **Content overflow**: No horizontal scroll
- ✅ **Button spacing**: Adequate gap between interactive elements
- ✅ **Card padding**: Proper margins and spacing
- ✅ **Text readability**: Appropriate font sizes

### Performance
- ✅ **Smooth animations**: No lag during interactions
- ✅ **Fast rendering**: Quick screen updates
- ✅ **Memory usage**: Efficient resource utilization

## Development Tips

### CSS Debugging
```jsx
// Add red borders to debug layout issues
sx={{ 
  border: '1px solid red',  // Temporary debugging
  width: { xs: 80, sm: 120 }
}}
```

### Console Logging
```jsx
// Log viewport dimensions
console.log('Viewport:', window.innerWidth, 'x', window.innerHeight);
```

### Testing Checklist
- [ ] All calculators load properly in mobile view
- [ ] Input fields are thumb-friendly (not too small/large)
- [ ] No horizontal scrolling required
- [ ] Buttons are easily tappable
- [ ] Text is readable without zooming
- [ ] Charts and graphs display correctly
- [ ] Navigation works smoothly

## Troubleshooting

### Simulator Not Appearing
1. Check you're in development mode (`npm run dev`)
2. Ensure JavaScript is enabled
3. Try refreshing the page
4. Check browser console for errors

### Layout Issues
1. Test on actual device for comparison
2. Use browser dev tools responsive mode
3. Check CSS media queries
4. Verify Material-UI breakpoints

### Performance Problems
1. Check for infinite re-renders
2. Optimize heavy calculations
3. Reduce unnecessary component updates
4. Use React DevTools Profiler

## Best Practices

### Mobile-First Design
1. **Start Small**: Design for mobile first, then scale up
2. **Touch-Friendly**: 44px minimum touch targets
3. **Readable Text**: 16px minimum font size
4. **Fast Loading**: Optimize for slower mobile networks

### Testing Strategy
1. **Multiple Devices**: Test on various screen sizes
2. **Real Devices**: Supplement simulator with actual devices
3. **Different Orientations**: Test portrait and landscape
4. **Accessibility**: Ensure screen reader compatibility

## Support

For issues or improvements to the mobile simulator, create an issue in the repository with:
- Device specifications
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

**Note**: This simulator is for development purposes only and should be removed or disabled in production builds.