import { Sphere } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Depth, Displace, Fresnel, LayerMaterial } from 'lamina'
import { useMemo, useRef, ComponentProps } from 'react'
import { MathUtils, Mesh, Vector3 } from 'three'
import { Displace as DisplaceType } from 'lamina/vanilla'

// 1. Extract the props type directly from the Displace component
type DisplaceProps = ComponentProps<typeof Displace>

// 2. Define the extended type for your imperative ref
type DisplaceRef = DisplaceType & { 
  strength: number; 
  offset: Vector3 
}

export default function Blob({
  displaceProps,
  ...props
}: ComponentProps<'group'> & {
  displaceProps?: DisplaceProps
}) {
  const ref = useRef<Mesh>(null!)
  const rand = useMemo(() => Math.random(), [])
  const strength = useRef(0)
  
  // Use the helper type here
  const displaceRef = useRef<DisplaceRef>(null!)

  useFrame(({ clock }, dt) => {
    if (!ref.current || !displaceRef.current) return

    ref.current.position.y = Math.sin(clock.elapsedTime + rand * 100) * 0.1 - 0.2

    if (displaceRef.current.strength !== strength.current) {
      displaceRef.current.strength = MathUtils.lerp(
        displaceRef.current.strength,
        strength.current,
        0.1
      )
    }

    if (strength.current > 0) {
      displaceRef.current.offset.x += 0.3 * dt
    }
  })

  return (
    <group {...props}>
      <Sphere
        castShadow
        onPointerEnter={() => (strength.current = 0.2)}
        onPointerLeave={() => (strength.current = 0)}
        ref={ref}
        args={[10, 50, 50]}
      >
        <LayerMaterial
          color={'#ffffff'}
          lighting={'physical'}
          transmission={1}
          roughness={0.1}
          thickness={2}
        >
          <Depth
            near={0.4854}
            far={0.7661999999999932}
            origin={[-0.4920000000000004, 0.4250000000000003, 0] as any}
            colorA={'#fec5da'}
            colorB={'#00b8fe'}
          />
          <Displace 
            ref={displaceRef} 
            strength={0} 
            scale={5} 
            offset={[0.09189000000357626, 0, 0]} 
            {...displaceProps} 
          />
          <Fresnel
            color={'#fefefe'}
            bias={-0.3430000000000002}
            intensity={3.8999999999999946}
            power={3.3699999999999903}
            factor={1.119999999999999}
            mode={'screen'}
          />
        </LayerMaterial>
      </Sphere>
    </group>
  )
}