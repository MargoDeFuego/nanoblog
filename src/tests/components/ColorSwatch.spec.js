import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ColorSwatch from '@/components/ColorSwatch.vue'

describe('ColorSwatch.vue', () => {
  it('рендерит div с правильным классом', () => {
    // 🧩 Arrange
    const wrapper = mount(ColorSwatch, {
      props: {
        color: { hex: '#ff0000' }
      }
    })

    // ⚙️ Act
    const div = wrapper.find('.swatch')

    // ✅ Assert
    expect(div.exists()).toBe(true)
    expect(div.classes()).toContain('swatch')
  })

  it('устанавливает правильный backgroundColor на основе props.color.hex', () => {
    // 🧩 Arrange
    const colorHex = '#00ff00'
    const wrapper = mount(ColorSwatch, {
      props: {
        color: { hex: colorHex }
      }
    })

    // ⚙️ Act
    const div = wrapper.find('.swatch')

    // ✅ Assert
    expect(div.attributes('style')).toMatch(/background-color:\s*(rgb\(0,\s*255,\s*0\)|#00ff00)/)
  })

  it('устанавливает атрибут title равным значению цвета', () => {
    // 🧩 Arrange
    const colorHex = '#0000ff'
    const wrapper = mount(ColorSwatch, {
      props: {
        color: { hex: colorHex }
      }
    })

    // ⚙️ Act
    const div = wrapper.find('.swatch')

    // ✅ Assert
    expect(div.attributes('title')).toBe(colorHex)
  })

  // 🆕 Новый тест — посмотрим вычисление computed "dark"
  it('лог вычисления dark', () => {
    // 🧩 Arrange
    const wrapper = mount(ColorSwatch, {
      props: {
        color: { hex: '#000000' } // черный = тёмный
      }
    })

    // ⚙️ Act + лог
    console.log('computed dark =', wrapper.vm.dark)

    // ✅ Assert
    expect(wrapper.vm.dark).toBe(true)
  })
})
