import { Icon } from '@/components/Icon'
import { BlockPill, type BlockType } from '@/components/primitives/BlockPill'
import { tokens } from '@/styles/tokens'

interface ActiveTopBarProps {
  blockLabel: string
  blockName: string
  blockType: BlockType
  current: number
  total: number
  onExit: () => void
}

export function ActiveTopBar({
  blockLabel,
  blockName,
  blockType,
  current,
  total,
  onExit,
}: ActiveTopBarProps) {
  return (
    <div style={{ padding: '8px 16px 12px', flexShrink: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <button
          onClick={onExit}
          style={{
            width: 32,
            height: 32,
            background: 'transparent',
            border: 'none',
            color: tokens.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: -6,
          }}
        >
          <Icon name="chevron-left" size={22} />
        </button>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: tokens.surface3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {blockLabel}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {blockName}
          </div>
          <BlockPill type={blockType} />
        </div>
        <div
          style={{
            fontSize: 12,
            color: tokens.textMuted,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          Block {current}/{total}
        </div>
      </div>
      {/* Block dot progress */}
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background:
                i < current - 1
                  ? tokens.primary
                  : i === current - 1
                    ? tokens.primary
                    : tokens.border,
            }}
          />
        ))}
      </div>
    </div>
  )
}
