import { describe, it, expect } from 'vitest';
import { hexToRgb, getBrightness, isDark } from '@/utils/colorUtils';

describe('colorUtils', () => {

  it('hexToRgb корректно переводит hex в rgb', () => {
    // Arrange
    const hex = '#ff0000';

    // Act
    const result = hexToRgb(hex);

    // Assert
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('getBrightness возвращает правильное значение яркости', () => {
    // Arrange
    const hex = '#ffffff';

    // Act
    const brightness = getBrightness(hex);

    // Assert
    expect(brightness).toBeCloseTo(255);
  });

  it('isDark корректно определяет тёмные цвета', () => {
    // Arrange
    const darkHex = '#000000';
    const lightHex = '#ffffff';

    // Act + Assert
    expect(isDark(darkHex)).toBe(true);
    expect(isDark(lightHex)).toBe(false);
  });

});
