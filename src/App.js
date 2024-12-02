import { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HexColorPicker } from 'react-colorful';

const serifFonts = [
  "'Playfair Display', serif",
  "'Merriweather', serif",
  "'Lora', serif",
  "'Crimson Text', serif",
  "'Noto Serif', serif",
  "'PT Serif', serif"
];

const sansSerifFonts = [
  "'Open Sans', sans-serif",
  "'Roboto', sans-serif",
  "'Lato', sans-serif",
  "'Poppins', sans-serif",
  "'Nunito', sans-serif",
  "'Work Sans', sans-serif"
];

function App() {
  const [colorPalette, setColorPalette] = useState({
    primary: '#ffffff',
    secondary: '#f0f0f0',
    accent: '#e0e0e0'
  });
  const [spacing, setSpacing] = useState(1);
  const [shrink, setShrink] = useState(1);
  const [layout, setLayout] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [layoutType, setLayoutType] = useState(0);
  const [columnSizes, setColumnSizes] = useState({
    sidebar: 2,
    main: 8
  });
  const [colorSchemeType, setColorSchemeType] = useState(0);
  const [fonts, setFonts] = useState({
    headers: serifFonts[0],
    content: sansSerifFonts[0],
    isSerifHeaders: true
  });
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [activeColorType, setActiveColorType] = useState(null);

  const generateColorScheme = (baseHue, type) => {
    // Generate random saturation and lightness within pleasing ranges
    const s = 65 + Math.random() * 25; // 65-90% saturation
    const l = 45 + Math.random() * 20; // 45-65% lightness

    switch(type) {
      case 0: // Monochromatic
        return {
          primary: RGBToHex(...Object.values(HSLToRGB(baseHue, s, l))),
          secondary: RGBToHex(...Object.values(HSLToRGB(baseHue, s - 20, l + 15))),
          accent: RGBToHex(...Object.values(HSLToRGB(baseHue, s + 10, l - 20)))
        };

      case 1: // Complementary
        const complementHue = (baseHue + 180) % 360;
        return {
          primary: RGBToHex(...Object.values(HSLToRGB(baseHue, s, l))),
          secondary: RGBToHex(...Object.values(HSLToRGB(complementHue, s - 10, l))),
          accent: RGBToHex(...Object.values(HSLToRGB(complementHue, s, l - 15)))
        };

      case 2: // Triadic
        const triad1 = (baseHue + 120) % 360;
        const triad2 = (baseHue + 240) % 360;
        return {
          primary: RGBToHex(...Object.values(HSLToRGB(baseHue, s, l))),
          secondary: RGBToHex(...Object.values(HSLToRGB(triad1, s - 5, l + 5))),
          accent: RGBToHex(...Object.values(HSLToRGB(triad2, s + 5, l - 5)))
        };

      case 3: // Split Complementary
        const split1 = (baseHue + 150) % 360;
        const split2 = (baseHue + 210) % 360;
        return {
          primary: RGBToHex(...Object.values(HSLToRGB(baseHue, s, l))),
          secondary: RGBToHex(...Object.values(HSLToRGB(split1, s - 10, l + 10))),
          accent: RGBToHex(...Object.values(HSLToRGB(split2, s + 5, l - 5)))
        };

      case 4: // Analogous
        return {
          primary: RGBToHex(...Object.values(HSLToRGB(baseHue, s, l))),
          secondary: RGBToHex(...Object.values(HSLToRGB((baseHue + 30) % 360, s - 5, l + 5))),
          accent: RGBToHex(...Object.values(HSLToRGB((baseHue + 60) % 360, s + 5, l - 10)))
        };

      case 5: // Tetradic (Double Complementary)
        const tetrad1 = (baseHue + 90) % 360;
        const tetrad2 = (baseHue + 180) % 360;
        return {
          primary: RGBToHex(...Object.values(HSLToRGB(baseHue, s, l))),
          secondary: RGBToHex(...Object.values(HSLToRGB(tetrad1, s - 10, l + 5))),
          accent: RGBToHex(...Object.values(HSLToRGB(tetrad2, s + 5, l - 5)))
        };
    }
  };

  const randomColor = () => {
    // Generate random base hue (0-360)
    const baseHue = Math.floor(Math.random() * 360);
    const newPalette = generateColorScheme(baseHue, colorSchemeType);
    setColorPalette(newPalette);
    applyColors(newPalette);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    applyColors(colorPalette);
    randomColor();
  };

  const applyColors = (palette) => {
    if (isDarkMode) {
      // Dark mode - professional greys with color accents
      const darkBg = '#121212';  // Very dark grey for main background
      const darkSurface = '#1E1E1E';  // Slightly lighter grey for components
      const darkSurfaceHighlight = '#2D2D2D';  // Highlighted surface color
      
      document.body.style.backgroundColor = darkBg;
      
      // Apply colors to posts with subtle color accent
      document.querySelectorAll('.post').forEach(post => {
        post.style.backgroundColor = darkSurface;
        post.style.color = '#E1E1E1';  // Light grey text
        post.style.border = '1px solid rgba(255, 255, 255, 0.05)';
        // Add subtle color accent to the border
        post.style.borderLeft = `3px solid ${adjustLightness(palette.secondary, '40%')}`;
        // Add subtle shadow for depth
        post.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      });

      // Apply colors to sidebars with different accent
      document.querySelectorAll('.sidebar').forEach(sidebar => {
        sidebar.style.backgroundColor = darkSurfaceHighlight;
        sidebar.style.color = '#E1E1E1';
        sidebar.style.border = '1px solid rgba(255, 255, 255, 0.05)';
        // Different color accent for sidebars
        sidebar.style.borderLeft = `3px solid ${adjustLightness(palette.accent, '40%')}`;
        sidebar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
      });

      // Enhance headers with color accents
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(header => {
        header.style.color = '#FFFFFF';  // White text for headers
        header.style.textShadow = 'none';  // Remove text shadow
        // Add subtle color accent
        header.style.borderBottom = `2px solid ${adjustLightness(palette.primary, '40%')}`;
        header.style.paddingBottom = '0.2em';
      });

      // Style buttons in dark mode
      document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.style.backgroundColor = adjustLightness(palette.primary, '40%');
        btn.style.borderColor = 'transparent';
        btn.style.color = '#FFFFFF';
      });

      // Style links in dark mode
      document.querySelectorAll('a').forEach(link => {
        link.style.color = adjustLightness(palette.accent, '60%');
      });

      // In dark mode section
      document.querySelectorAll('.fas, .fab, .far').forEach(icon => {
        icon.style.color = adjustLightness(palette.accent, '60%');
      });

    } else {
      // Light mode - clean design with subtle color accents
      const lightBg = adjustLightness(colorPalette.primary, '97%');
      const lightSurface = adjustLightness(colorPalette.secondary, '95%');
      
      document.body.style.backgroundColor = lightBg;
      
      // Apply colors to posts with subtle color accent
      document.querySelectorAll('.post').forEach(post => {
        post.style.backgroundColor = lightSurface;
        post.style.color = '#000000';
        post.style.border = '1px solid rgba(0, 0, 0, 0.05)';
        // Add subtle color accent to the border
        post.style.borderLeft = `3px solid ${adjustLightness(palette.secondary, '60%')}`;
        // Add subtle shadow for depth
        post.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
      });

      // Apply colors to sidebars with different accent
      document.querySelectorAll('.sidebar').forEach(sidebar => {
        sidebar.style.backgroundColor = adjustLightness(palette.accent, '92%');
        sidebar.style.color = '#000000';
        sidebar.style.border = '1px solid rgba(0, 0, 0, 0.05)';
        // Different color accent for sidebars
        sidebar.style.borderLeft = `3px solid ${adjustLightness(palette.accent, '60%')}`;
        sidebar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
      });

      // Enhance headers with color accents
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(header => {
        header.style.color = '#000000';
        header.style.borderBottom = `2px solid ${adjustLightness(palette.primary, '70%')}`;
        header.style.paddingBottom = '0.2em';
      });

      // Style buttons in light mode
      document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.style.backgroundColor = palette.primary;
        btn.style.borderColor = 'transparent';
        btn.style.color = '#FFFFFF';
        btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      });

      // Style links in light mode
      document.querySelectorAll('a').forEach(link => {
        link.style.color = adjustLightness(palette.accent, '40%');
      });

      // In light mode section
      document.querySelectorAll('.fas, .fab, .far').forEach(icon => {
        icon.style.color = adjustLightness(palette.accent, '40%');
      });
    }
  };

  const hexToRGB = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const RGBToHex = (r, g, b) => {
    return '#' + [r, g, b]
      .map(x => Math.round(x).toString(16).padStart(2, '0'))
      .join('');
  };

  const RGBToHSL = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return [h, s * 100, l * 100];
  };

  const HSLToRGB = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return {
      r: 255 * f(0),
      g: 255 * f(8),
      b: 255 * f(4)
    };
  };

  const adjustLightness = (hex, lightness) => {
    const rgb = hexToRGB(hex);
    const [h, s, l] = RGBToHSL(rgb.r, rgb.g, rgb.b);
    const newRGB = HSLToRGB(h, s, parseFloat(lightness));
    return RGBToHex(newRGB.r, newRGB.g, newRGB.b);
  };

  const spaceOut = () => {
    setSpacing(prev => {
      const newSpacing = prev + 0.5;
      document.documentElement.style.setProperty('--bs-gutter-x', `${newSpacing * 1.5}rem`);
      document.documentElement.style.setProperty('--bs-gutter-y', `${newSpacing * 1.5}rem`);
      return newSpacing;
    });
    
    setColumnSizes(prev => {
      const newSidebar = Math.min(prev.sidebar + 1, 3);
      const newMain = Math.max(12 - (newSidebar * 2), 4);
      return {
        sidebar: newSidebar,
        main: newMain
      };
    });
  };

  const closeIn = () => {
    if (spacing > 0.5) {
      setSpacing(prev => {
        const newSpacing = prev - 0.5;
        document.documentElement.style.setProperty('--bs-gutter-x', `${newSpacing * 1.5}rem`);
        document.documentElement.style.setProperty('--bs-gutter-y', `${newSpacing * 1.5}rem`);
        return newSpacing;
      });
      
      setColumnSizes(prev => {
        const newSidebar = Math.max(prev.sidebar - 1, 1);
        const newMain = Math.min(12 - (newSidebar * 2), 10);
        return {
          sidebar: newSidebar,
          main: newMain
        };
      });
    }
  };

  const growElements = () => {
    setShrink(shrink * 1.1);
  };

  const shrinkElements = () => {
    setShrink(shrink * 0.9);
  };

  const cycleLayout = () => {
    setLayoutType((layoutType + 1) % 11);
  };

  const cycleColorScheme = () => {
    setColorSchemeType((prev) => (prev + 1) % 6);
    randomColor();
  };

  const cycleFonts = () => {
    const isSerifHeaders = !fonts.isSerifHeaders;
    const headerFonts = isSerifHeaders ? serifFonts : sansSerifFonts;
    const contentFonts = isSerifHeaders ? sansSerifFonts : serifFonts;
    
    const randomHeaderFont = headerFonts[Math.floor(Math.random() * headerFonts.length)];
    const randomContentFont = contentFonts[Math.floor(Math.random() * contentFonts.length)];
    
    setFonts({
      headers: randomHeaderFont,
      content: randomContentFont,
      isSerifHeaders
    });
    
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(header => {
      header.style.fontFamily = randomHeaderFont;
    });
    
    document.querySelectorAll('p, li, a, button').forEach(content => {
      content.style.fontFamily = randomContentFont;
    });
  };

  const getLayoutContent = () => {
    switch(layoutType) {
      case 0:
        return (
          <div className="row">
            <div className={`col-md-${columnSizes.sidebar}`}>
              <div className="sidebar">
                <img src="https://via.placeholder.com/150" alt="Profile" className="img-fluid rounded-circle mb-3" />
                <h3>Navigation</h3>
                <ul className="list-unstyled">
                  <li>Home</li>
                  <li>About</li>
                  <li>Services</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>

            <div className={`col-md-${columnSizes.main}`}>
              <div className="post">
                <img src="https://via.placeholder.com/800x400" alt="Main Article" className="img-fluid mb-3" />
                <h2>Main Article</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
              <div className="post">
                <div className="row">
                  <div className="col-md-4">
                    <img src="https://via.placeholder.com/300x200" alt="Secondary" className="img-fluid mb-3" />
                  </div>
                  <div className="col-md-8">
                    <h3>Secondary Article</h3>
                    <p>Ut enim ad minim veniam, quis nostrud exercitation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`col-md-${columnSizes.sidebar}`}>
              <div className="sidebar">
                <h3>Recent Posts</h3>
                {[1, 2, 3].map(i => (
                  <div key={i} className="mb-3">
                    <img src={`https://via.placeholder.com/100x70?text=Post${i}`} alt={`Post ${i}`} className="img-fluid mb-2" />
                    <div>Post {i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="post h-100">
                <img src="https://via.placeholder.com/600x400" alt="Featured" className="img-fluid" />
                <div className="card-body">
                  <h2>Featured Content</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary">Learn More</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row g-4">
                {[1, 2, 3, 4].map(i => (
                  <div className="col-sm-6" key={i}>
                    <div className="post h-100">
                      <img src={`https://via.placeholder.com/300x200?text=Card${i}`} alt={`Card ${i}`} className="img-fluid" />
                      <div className="card-body">
                        <h3>Card {i}</h3>
                        <p>Quick summary of content.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="row" style={{ columns: '3 250px', columnGap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div className="col-12 mb-4" key={i} style={{ breakInside: 'avoid' }}>
                <div className="post">
                  <img 
                    src={`https://via.placeholder.com/400x${200 + (i % 3) * 100}`} 
                    alt={`Post ${i}`} 
                    className="img-fluid mb-3" 
                  />
                  <h3>Post {i}</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <>
            <div className="row mb-4">
              <div className="col-12">
                <div className="post p-5 text-center">
                  <h1 className="display-4">Welcome to Our Site</h1>
                  <p className="lead">This is a hero section with a beautiful background.</p>
                  <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-primary btn-lg">Get Started</button>
                    <button className="btn btn-outline-secondary btn-lg">Learn More</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-4">
              {[1, 2, 3].map(i => (
                <div className="col-md-4" key={i}>
                  <div className="post h-100">
                    <div className="card-body">
                      <h3>Feature {i}</h3>
                      <p>Discover what makes us special.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-outline-primary">All</button>
                  <button className="btn btn-outline-primary">Web</button>
                  <button className="btn btn-outline-primary">Design</button>
                  <button className="btn btn-outline-primary">Brand</button>
                </div>
              </div>
            </div>
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div className="col-md-4 col-sm-6" key={i}>
                  <div className="post position-relative overflow-hidden" style={{aspectRatio: "1"}}>
                    <img 
                      src={`https://via.placeholder.com/400x400?text=Project${i}`} 
                      alt={`Project ${i}`} 
                      className="img-fluid w-100 h-100 object-fit-cover" 
                    />
                    <div className="position-absolute start-0 bottom-0 p-3 w-100 bg-dark bg-opacity-75">
                      <h5 className="mb-0">Project {i}</h5>
                      <small>Category</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className="row mb-4">
              <div className="col-lg-8">
                <div className="post mb-4">
                  <div className="row g-0">
                    <div className="col-md-6">
                      <div className="p-4">
                        <span className="badge bg-primary mb-2">Featured</span>
                        <h2>Main Blog Post</h2>
                        <p className="text-muted">Posted by Admin | 5 mins read</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <button className="btn btn-outline-primary">Read More</button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <img 
                        src="https://via.placeholder.com/600x400" 
                        alt="Featured Post" 
                        className="img-fluid h-100 object-fit-cover" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="post mb-4">
                  <div className="p-4">
                    <h4>Newsletter</h4>
                    <div className="input-group mb-3">
                      <input type="email" className="form-control" placeholder="Enter email"/>
                      <button className="btn btn-primary">Subscribe</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row g-4">
              {[1, 2, 3].map(i => (
                <div className="col-md-4" key={i}>
                  <div className="post h-100">
                    <div className="p-3">
                      <small className="text-muted">Category {i}</small>
                      <h4>Blog Post {i}</h4>
                      <p>Quick summary of the blog post content.</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">5 mins read</small>
                        <button className="btn btn-sm btn-outline-primary">Read</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 6:
        return (
          <>
            <div className="row g-4">
              {[1, 2, 3, 4].map(i => (
                <div className="col-xl-3 col-md-6" key={i}>
                  <div className="post">
                    <div className="d-flex justify-content-between align-items-center p-3">
                      <div>
                        <h6 className="mb-0">Metric {i}</h6>
                        <h3 className="mb-0">{Math.floor(Math.random() * 1000)}</h3>
                        <small className="text-success">+{Math.floor(Math.random() * 100)}%</small>
                      </div>
                      <div className="fs-1 opacity-25">📊</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row g-4 mt-2">
              <div className="col-lg-8">
                <div className="post p-4">
                  <h4>Analytics Overview</h4>
                  <div className="bg-light p-4 mt-3" style={{height: "300px"}}>
                    {/* Chart placeholder */}
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="post p-4">
                  <h4>Recent Activity</h4>
                  <div className="list-group list-group-flush">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="list-group-item bg-transparent">
                        <div className="d-flex justify-content-between">
                          <span>Activity {i}</span>
                          <small className="text-muted">2h ago</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 7:
        return (
          <>
            <div className="row align-items-center mb-5">
              <div className="col-lg-6">
                <div className="post p-4">
                  <span className="badge bg-primary mb-2">New</span>
                  <h1 className="display-4 mb-4">Welcome to Our Platform</h1>
                  <p className="lead mb-4">Transform your business with our innovative solutions.</p>
                  <div className="d-flex gap-3">
                    <button className="btn btn-primary btn-lg">Get Started</button>
                    <button className="btn btn-outline-secondary btn-lg">Watch Demo</button>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="post p-4 text-center">
                  <img 
                    src="https://via.placeholder.com/600x400?text=Hero+Image" 
                    alt="Hero" 
                    className="img-fluid rounded" 
                  />
                </div>
              </div>
            </div>
            <div className="row g-4">
              {[1, 2, 3].map(i => (
                <div className="col-md-4" key={i}>
                  <div className="post h-100">
                    <div className="p-4 text-center">
                      <img 
                        src={`https://via.placeholder.com/200x200?text=Feature${i}`} 
                        alt={`Feature ${i}`} 
                        className="img-fluid mb-4 rounded-circle" 
                      />
                      <h3>Feature {i}</h3>
                      <p>Discover how our platform can help you achieve your goals.</p>
                      <button className="btn btn-outline-primary mt-3">Learn More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case 8: // Modern Landing Page
        return (
          <>
            {/* Navbar with CTA */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="post p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <img src="https://via.placeholder.com/40" alt="Logo" className="rounded-circle" />
                      <span className="fw-bold fs-4">Brand</span>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className="d-none d-md-inline">Ready to get started?</span>
                      <button className="btn btn-primary">Sign Up Now</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="row mb-5 position-relative">
              <div className="col-12">
                <div className="position-relative" style={{ height: '80vh', overflow: 'hidden' }}>
                  <img 
                    src="https://via.placeholder.com/1920x1080" 
                    alt="Hero" 
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" 
                       style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7))' }}>
                    <div className="container text-white">
                      <div className="row">
                        <div className="col-md-8 col-lg-6">
                          <h1 className="display-3 fw-bold mb-4">Transform Your Vision Into Reality</h1>
                          <p className="lead mb-4">Create stunning websites with our innovative platform. Start your journey today.</p>
                          <div className="d-flex gap-3">
                            <button className="btn btn-primary btn-lg">Get Started</button>
                            <button className="btn btn-outline-light btn-lg">Learn More</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Grid */}
            <div className="row g-4">
              <div className="col-md-6">
                <div className="post h-100">
                  <div className="p-4">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="bg-primary rounded-circle p-3">
                        <i className="fas fa-rocket text-white fs-4">🚀</i>
                      </div>
                      <h3 className="mb-0">Lightning Fast</h3>
                    </div>
                    <p className="mb-4">Experience blazing fast performance with our optimized platform. Built for speed and efficiency.</p>
                    <a href="#" className="text-primary text-decoration-none">Learn more →</a>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="post h-100">
                  <div className="p-4">
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="bg-primary rounded-circle p-3">
                        <i className="fas fa-shield text-white fs-4">🛡️</i>
                      </div>
                      <h3 className="mb-0">Secure & Reliable</h3>
                    </div>
                    <p className="mb-4">Your data is safe with us. Enterprise-grade security with 99.9% uptime guarantee.</p>
                    <a href="#" className="text-primary text-decoration-none">Learn more →</a>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 9: // F-Pattern Layout
        return (
          <>
            {/* Top Bar - Full Width */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="post p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h1 className="display-5 mb-0">Featured News</h1>
                    <button className="btn btn-primary">Subscribe Now</button>
                  </div>
                </div>
              </div>
            </div>

            {/* First Row - Main Content */}
            <div className="row mb-4">
              <div className="col-lg-8">
                <div className="post p-0">
                  <img 
                    src="https://via.placeholder.com/1200x600" 
                    alt="Main Feature" 
                    className="img-fluid w-100"
                  />
                  <div className="p-4">
                    <span className="badge bg-primary mb-2">Breaking</span>
                    <h2>Major Headline Story</h2>
                    <p className="lead">The most important story of the day with compelling details and imagery.</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="post h-100">
                  <h3>Quick Links</h3>
                  <div className="list-group list-group-flush">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="list-group-item bg-transparent">
                        <div className="d-flex align-items-center">
                          <img 
                            src={`https://via.placeholder.com/50?text=${i}`} 
                            alt={`Link ${i}`}
                            className="rounded me-3"
                          />
                          <div>
                            <h6 className="mb-0">Quick Story {i}</h6>
                            <small className="text-muted">2h ago</small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Second Row - Three Columns */}
            <div className="row g-4 mb-4">
              {[1, 2, 3].map(i => (
                <div className="col-md-4" key={i}>
                  <div className="post p-0">
                    <img 
                      src={`https://via.placeholder.com/400x300?text=Story${i}`}
                      alt={`Story ${i}`}
                      className="img-fluid w-100"
                    />
                    <div className="p-3">
                      <h4>Secondary Story {i}</h4>
                      <p>Brief description of the story with engaging content.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Third Row - Left Content */}
            <div className="row mb-4">
              <div className="col-lg-8">
                <div className="post">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <img 
                        src="https://via.placeholder.com/600x400"
                        alt="Left Story"
                        className="img-fluid rounded"
                      />
                    </div>
                    <div className="col-md-6">
                      <h3>Left-aligned Story</h3>
                      <p>Detailed coverage of an important topic with supporting information.</p>
                      <button className="btn btn-outline-primary">Read More</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 10: // Modern F-Pattern with Cards
        return (
          <>
            {/* Hero Banner */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="post p-0 position-relative">
                  <img 
                    src="https://via.placeholder.com/1920x600"
                    alt="Hero Banner"
                    className="img-fluid w-100"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
                       style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)' }}>
                    <div className="container text-white">
                      <div className="col-lg-6">
                        <h1 className="display-4 fw-bold mb-3">Trending Now</h1>
                        <p className="lead mb-4">Discover the latest updates and trending stories in your field.</p>
                        <button className="btn btn-primary btn-lg">Explore More</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Cards Row */}
            <div className="row g-4 mb-4">
              {[1, 2, 3, 4].map(i => (
                <div className="col-md-3" key={i}>
                  <div className="post p-0 h-100">
                    <div className="position-relative">
                      <img 
                        src={`https://via.placeholder.com/300x200?text=Feature${i}`}
                        alt={`Feature ${i}`}
                        className="img-fluid w-100"
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-primary">New</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h5>Featured Item {i}</h5>
                      <p className="small">Quick overview of the featured content.</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Left Content Block */}
            <div className="row mb-4">
              <div className="col-lg-8">
                <div className="post">
                  <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary rounded-circle p-2 me-3">
                      <i className="fas fa-star text-white">⭐</i>
                    </div>
                    <h2 className="mb-0">Editor's Pick</h2>
                  </div>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <img 
                        src="https://via.placeholder.com/400x300"
                        alt="Editor's Pick"
                        className="img-fluid rounded mb-3"
                      />
                      <h4>Main Story Title</h4>
                      <p>Detailed coverage with in-depth analysis and expert insights.</p>
                    </div>
                    <div className="col-md-6">
                      <div className="list-group">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="list-group-item bg-transparent border-0 px-0">
                            <div className="d-flex align-items-center">
                              <img 
                                src={`https://via.placeholder.com/80x60?text=${i}`}
                                alt={`Story ${i}`}
                                className="rounded me-3"
                              />
                              <div>
                                <h6 className="mb-1">Related Story {i}</h6>
                                <small className="text-muted">3h ago</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="post">
                  <h4 className="mb-4">Trending Topics</h4>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="d-flex align-items-center mb-3">
                      <div className="display-4 opacity-25 me-3">{i}</div>
                      <div>
                        <h6 className="mb-1">Trending Topic {i}</h6>
                        <small className="text-muted">{Math.floor(Math.random() * 1000)}k views</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const exportCSS = () => {
    // Get current layout type and color scheme
    const currentLayout = layoutType;
    
    const css = `
      /* Base styles and color scheme */
      :root {
        --primary-color: ${colorPalette.primary};
        --secondary-color: ${colorPalette.secondary};
        --accent-color: ${colorPalette.accent};
        --spacing: ${spacing}em;
        --gutter: ${spacing * 1.5}rem;
      }

      body {
        background-color: ${adjustLightness(colorPalette.primary, isDarkMode ? '12%' : '97%')};
        color: ${isDarkMode ? '#ffffff' : '#000000'};
        font-family: ${fonts.content};
        line-height: 1.6;
      }

      /* Typography */
      h1, h2, h3, h4, h5, h6 {
        font-family: ${fonts.headers};
        ${isDarkMode ? 'text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);' : ''}
        margin-bottom: 1rem;
      }

      /* Component styles */
      .post {
        background-color: ${adjustLightness(colorPalette.secondary, isDarkMode ? '20%' : '95%')};
        color: ${isDarkMode ? '#ffffff' : '#000000'};
        border-radius: 0.375rem;
        ${isDarkMode ? 'border: 1px solid rgba(255, 255, 255, 0.1);' : ''}
        padding: 1.5rem;
        margin-bottom: var(--gutter);
        transition: all 0.3s ease;
      }

      .sidebar {
        background-color: ${adjustLightness(colorPalette.accent, isDarkMode ? '15%' : '90%')};
        color: ${isDarkMode ? '#ffffff' : '#000000'};
        border-radius: 0.375rem;
        ${isDarkMode ? 'border: 1px solid rgba(255, 255, 255, 0.1);' : ''}
        padding: 1.5rem;
        margin-bottom: var(--gutter);
      }

      /* Grid system */
      .container {
        width: 100%;
        padding-right: var(--gutter);
        padding-left: var(--gutter);
        margin-right: auto;
        margin-left: auto;
        max-width: 1140px;
      }

      .row {
        display: flex;
        flex-wrap: wrap;
        margin-right: calc(-0.5 * var(--gutter));
        margin-left: calc(-0.5 * var(--gutter));
      }

      /* Responsive columns */
      .col-md-${columnSizes.sidebar} {
        flex: 0 0 ${(columnSizes.sidebar / 12) * 100}%;
        max-width: ${(columnSizes.sidebar / 12) * 100}%;
        padding: 0 calc(0.5 * var(--gutter));
      }

      .col-md-${columnSizes.main} {
        flex: 0 0 ${(columnSizes.main / 12) * 100}%;
        max-width: ${(columnSizes.main / 12) * 100}%;
        padding: 0 calc(0.5 * var(--gutter));
      }

      /* Utility classes */
      .img-fluid {
        max-width: 100%;
        height: auto;
      }

      .rounded {
        border-radius: 0.375rem;
      }

      .rounded-circle {
        border-radius: 50%;
      }

      .text-center {
        text-align: center;
      }

      .mb-3 {
        margin-bottom: 1rem;
      }

      .mb-4 {
        margin-bottom: 1.5rem;
      }

      .p-3 {
        padding: 1rem;
      }

      .p-4 {
        padding: 1.5rem;
      }

      /* Button styles */
      .btn {
        display: inline-block;
        font-weight: 400;
        text-align: center;
        vertical-align: middle;
        user-select: none;
        padding: 0.375rem 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        border-radius: 0.25rem;
        transition: all 0.15s ease-in-out;
      }

      .btn-primary {
        background-color: ${colorPalette.primary};
        border-color: ${colorPalette.primary};
        color: ${isDarkMode ? '#000000' : '#ffffff'};
      }

      .btn-outline-primary {
        border: 1px solid ${colorPalette.primary};
        color: ${colorPalette.primary};
      }

      /* Layout specific styles */
      ${currentLayout === 2 ? `
      .masonry-grid {
        columns: 3 250px;
        column-gap: 1.5rem;
      }
      
      .masonry-item {
        break-inside: avoid;
        margin-bottom: 1.5rem;
      }
      ` : ''}

      ${currentLayout === 8 ? `
      .hero-section {
        position: relative;
        height: 80vh;
        overflow: hidden;
      }

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7));
        display: flex;
        align-items: center;
      }

      .feature-icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${colorPalette.primary};
        color: white;
        margin-bottom: 1rem;
      }
      ` : ''}

      /* Media queries */
      @media (max-width: 768px) {
        .col-md-${columnSizes.sidebar}, .col-md-${columnSizes.main} {
          flex: 0 0 100%;
          max-width: 100%;
        }
        
        .hero-section {
          height: 60vh;
        }
      }

      /* Icon styles */
      .fas, .fab, .far {
        color: ${isDarkMode ? 
          adjustLightness(colorPalette.accent, '60%') : 
          adjustLightness(colorPalette.accent, '40%')
        };
        transition: color 0.3s ease;
      }

      .btn .fas,
      .btn .fab,
      .btn .far {
        color: inherit;
      }
    `;

    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `layout-${layoutType + 1}-theme.css`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleColorChange = (newColor) => {
    if (activeColorType) {
      const newPalette = {
        ...colorPalette,
        [activeColorType]: newColor
      };
      setColorPalette(newPalette);
      applyColors(newPalette);
    }
  };

  const ColorPickerDropdown = () => (
    <div className="position-absolute top-100 start-0 mt-2 p-3 rounded shadow-lg" 
         style={{ 
           backgroundColor: isDarkMode ? '#2D2D2D' : '#ffffff',
           zIndex: 1000,
           width: '300px'
         }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">Color Scheme</h6>
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setIsColorPickerOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="row g-3 mb-3">
        {Object.entries(colorPalette).map(([type, color]) => (
          <div className="col-4" key={type}>
            <div 
              className={`color-swatch p-2 rounded text-center ${activeColorType === type ? 'border border-primary' : ''}`}
              onClick={() => setActiveColorType(type)}
              style={{ 
                backgroundColor: color,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <small style={{ 
                color: isDarkMode ? '#fff' : '#000',
                textTransform: 'capitalize',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                {type}
              </small>
            </div>
          </div>
        ))}
      </div>
      {activeColorType && (
        <div>
          <HexColorPicker 
            color={colorPalette[activeColorType]} 
            onChange={handleColorChange}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isColorPickerOpen && !event.target.closest('.color-picker-container')) {
        setIsColorPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isColorPickerOpen]);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand" href="#">Template Builder</span>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto">
              <div className="position-relative color-picker-container">
                <button 
                  className="btn btn-primary mx-1" 
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                >
                  <i className="fas fa-palette me-2"></i>
                  Colors {colorSchemeType === 0 ? '(Mono)' : 
                          colorSchemeType === 1 ? '(Complement)' : 
                          colorSchemeType === 2 ? '(Triadic)' :
                          colorSchemeType === 3 ? '(Split)' :
                          colorSchemeType === 4 ? '(Analogous)' : '(Tetradic)'}
                </button>
                {isColorPickerOpen && <ColorPickerDropdown />}
              </div>
              <button 
                className="btn btn-outline-primary mx-1" 
                onClick={cycleColorScheme}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Cycle Scheme
              </button>
              <button className="btn btn-secondary mx-1" onClick={spaceOut}>
                <i className="fas fa-expand me-2"></i>
              </button>
              <button className="btn btn-success mx-1" onClick={closeIn}>
                <i className="fas fa-compress me-2"></i>
              </button>
              <button className="btn btn-danger mx-1" onClick={growElements}>
                <i className="fas fa-up-right-and-down-left-from-center me-2"></i>
              </button>
              <button className="btn btn-warning mx-1" onClick={shrinkElements}>
                <i className="fas fa-down-left-and-up-right-to-center me-2"></i>
              </button>
              <button 
                className="btn btn-info mx-1" 
                onClick={cycleLayout}
              >
                <i className={`fas ${
                  layoutType === 0 ? 'fa-columns' :
                  layoutType === 1 ? 'fa-th-large' :
                  layoutType === 2 ? 'fa-grip' :
                  layoutType === 3 ? 'fa-layer-group' :
                  layoutType === 4 ? 'fa-images' :
                  layoutType === 5 ? 'fa-newspaper' :
                  layoutType === 6 ? 'fa-chart-pie' :
                  layoutType === 7 ? 'fa-rocket' :
                  layoutType === 8 ? 'fa-window-maximize' :
                  layoutType === 9 ? 'fa-table-columns' :
                  'fa-table-cells-large'
                } me-2`} style={{ color: isDarkMode ? '#fff' : '#000' }}></i>
                 ({layoutType + 1}/11)
              </button>
              <button 
                className={`btn ${isDarkMode ? 'btn-light' : 'btn-dark'} mx-1`} 
                onClick={toggleDarkMode}
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} me-2`}></i>
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
              <button 
                className="btn btn-outline-secondary mx-1" 
                onClick={cycleFonts}
              >
                <i className="fas fa-font me-2"></i>
                {fonts.isSerifHeaders ? 'Serif' : 'Sans'}
              </button>
              <button className="btn btn-light mx-1" onClick={exportCSS}>
                <i className="fas fa-file-export me-2"></i>
                Export
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="content-wrapper" style={{
        padding: `${spacing}em`,
        transform: `scale(${shrink})`,
        transition: 'all 0.3s ease',
        marginTop: '60px',
        '--bs-gutter-x': `${spacing * 1.5}rem`,
        '--bs-gutter-y': `${spacing * 1.5}rem`,
        position: 'relative'
      }}>
        <div className="container">
          {getLayoutContent()}
        </div>
      </div>
    </div>
  );
}

export default App;