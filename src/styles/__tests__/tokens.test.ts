import { tokens } from '../tokens'

test('primary token matches design system', () => {
  expect(tokens.primary).toBe('#7BD88F')
})
test('accent token matches design system', () => {
  expect(tokens.accent).toBe('#F59E0B')
})
test('bg token matches design system', () => {
  expect(tokens.bg).toBe('#0F1115')
})
test('rest token matches design system', () => {
  expect(tokens.rest).toBe('#60A5FA')
})
test('danger token matches design system', () => {
  expect(tokens.danger).toBe('#F87171')
})
