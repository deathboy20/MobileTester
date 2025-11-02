/**
 * Top 20 Android devices for testing
 * These devices represent the most popular Android devices by market share
 * and cover different Android versions, screen sizes, and manufacturers
 */

export interface Device {
  id: string;
  name: string;
  manufacturer: string;
  androidVersion: string;
  apiLevel: number;
  screenSize: string;
  resolution: string;
  popular: boolean;
}

export const TOP_20_DEVICES: Device[] = [
  {
    id: 'samsung_galaxy_s24',
    name: 'Samsung Galaxy S24',
    manufacturer: 'Samsung',
    androidVersion: '14',
    apiLevel: 34,
    screenSize: '6.2"',
    resolution: '2340 x 1080',
    popular: true,
  },
  {
    id: 'samsung_galaxy_s23',
    name: 'Samsung Galaxy S23',
    manufacturer: 'Samsung',
    androidVersion: '13',
    apiLevel: 33,
    screenSize: '6.1"',
    resolution: '2340 x 1080',
    popular: true,
  },
  {
    id: 'pixel_8_pro',
    name: 'Google Pixel 8 Pro',
    manufacturer: 'Google',
    androidVersion: '14',
    apiLevel: 34,
    screenSize: '6.7"',
    resolution: '2992 x 1344',
    popular: true,
  },
  {
    id: 'pixel_7',
    name: 'Google Pixel 7',
    manufacturer: 'Google',
    androidVersion: '13',
    apiLevel: 33,
    screenSize: '6.3"',
    resolution: '2400 x 1080',
    popular: true,
  },
  {
    id: 'oneplus_11',
    name: 'OnePlus 11',
    manufacturer: 'OnePlus',
    androidVersion: '13',
    apiLevel: 33,
    screenSize: '6.7"',
    resolution: '3216 x 1440',
    popular: true,
  },
  {
    id: 'xiaomi_13_pro',
    name: 'Xiaomi 13 Pro',
    manufacturer: 'Xiaomi',
    androidVersion: '13',
    apiLevel: 33,
    screenSize: '6.73"',
    resolution: '3200 x 1440',
    popular: true,
  },
  {
    id: 'samsung_galaxy_a54',
    name: 'Samsung Galaxy A54',
    manufacturer: 'Samsung',
    androidVersion: '13',
    apiLevel: 33,
    screenSize: '6.4"',
    resolution: '2340 x 1080',
    popular: true,
  },
  {
    id: 'samsung_galaxy_note_20',
    name: 'Samsung Galaxy Note 20',
    manufacturer: 'Samsung',
    androidVersion: '12',
    apiLevel: 31,
    screenSize: '6.7"',
    resolution: '2400 x 1080',
    popular: false,
  },
  {
    id: 'huawei_p50_pro',
    name: 'Huawei P50 Pro',
    manufacturer: 'Huawei',
    androidVersion: '11',
    apiLevel: 30,
    screenSize: '6.6"',
    resolution: '2700 x 1228',
    popular: false,
  },
  {
    id: 'oppo_find_x5_pro',
    name: 'OPPO Find X5 Pro',
    manufacturer: 'OPPO',
    androidVersion: '12',
    apiLevel: 31,
    screenSize: '6.7"',
    resolution: '3216 x 1440',
    popular: false,
  },
  {
    id: 'vivo_x80_pro',
    name: 'Vivo X80 Pro',
    manufacturer: 'Vivo',
    androidVersion: '12',
    apiLevel: 31,
    screenSize: '6.78"',
    resolution: '3200 x 1440',
    popular: false,
  },
  {
    id: 'motorola_edge_30',
    name: 'Motorola Edge 30',
    manufacturer: 'Motorola',
    androidVersion: '12',
    apiLevel: 31,
    screenSize: '6.5"',
    resolution: '2400 x 1080',
    popular: false,
  },
  {
    id: 'lg_wing',
    name: 'LG Wing',
    manufacturer: 'LG',
    androidVersion: '11',
    apiLevel: 30,
    screenSize: '6.8"',
    resolution: '2460 x 1080',
    popular: false,
  },
  {
    id: 'samsung_galaxy_s22_ultra',
    name: 'Samsung Galaxy S22 Ultra',
    manufacturer: 'Samsung',
    androidVersion: '13',
    apiLevel: 33,
    screenSize: '6.8"',
    resolution: '3088 x 1440',
    popular: true,
  },
  {
    id: 'pixel_6a',
    name: 'Google Pixel 6a',
    manufacturer: 'Google',
    androidVersion: '13',
    apiLevel: 33,
    screenSize: '6.1"',
    resolution: '2400 x 1080',
    popular: true,
  },
  {
    id: 'nothing_phone_1',
    name: 'Nothing Phone (1)',
    manufacturer: 'Nothing',
    androidVersion: '12',
    apiLevel: 31,
    screenSize: '6.55"',
    resolution: '2400 x 1080',
    popular: false,
  },
  {
    id: 'realme_gt_2_pro',
    name: 'Realme GT 2 Pro',
    manufacturer: 'Realme',
    androidVersion: '12',
    apiLevel: 31,
    screenSize: '6.7"',
    resolution: '3216 x 1440',
    popular: false,
  },
  {
    id: 'sony_xperia_1_iv',
    name: 'Sony Xperia 1 IV',
    manufacturer: 'Sony',
    androidVersion: '12',
    apiLevel: 31,
    screenSize: '6.5"',
    resolution: '3840 x 1644',
    popular: false,
  },
  {
    id: 'asus_rog_phone_6',
    name: 'ASUS ROG Phone 6',
    manufacturer: 'ASUS',
    androidVersion: '12',
    apiLevel: 31,
    screenSize: '6.78"',
    resolution: '2448 x 1080',
    popular: false,
  },
  {
    id: 'fairphone_4',
    name: 'Fairphone 4',
    manufacturer: 'Fairphone',
    androidVersion: '11',
    apiLevel: 30,
    screenSize: '6.3"',
    resolution: '2340 x 1080',
    popular: false,
  },
];

/**
 * Get device by ID
 */
export const getDeviceById = (id: string): Device | undefined => {
  return TOP_20_DEVICES.find(device => device.id === id);
};

/**
 * Get popular devices (most commonly used for testing)
 */
export const getPopularDevices = (): Device[] => {
  return TOP_20_DEVICES.filter(device => device.popular);
};

/**
 * Get devices by Android API level
 */
export const getDevicesByApiLevel = (apiLevel: number): Device[] => {
  return TOP_20_DEVICES.filter(device => device.apiLevel === apiLevel);
};

/**
 * Get devices by manufacturer
 */
export const getDevicesByManufacturer = (manufacturer: string): Device[] => {
  return TOP_20_DEVICES.filter(device =>
    device.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
};

/**
 * Default device selection for new users (most popular 5 devices)
 */
export const DEFAULT_DEVICE_SELECTION = [
  'samsung_galaxy_s24',
  'samsung_galaxy_s23',
  'pixel_8_pro',
  'pixel_7',
  'samsung_galaxy_s22_ultra',
];
