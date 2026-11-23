import { ContactShadows, Environment, Lightformer } from '@react-three/drei'

/**
 * A small studio built from area lights. No external HDR is fetched, so the
 * product always has clean reflections and the page never depends on a
 * remote asset. Warm key light, cool fill, one soft rim.
 */
export function Lighting({ dark = false }) {
  return (
    <>
      <ambientLight intensity={dark ? 0.3 : 0.55} />
      <directionalLight position={[4, 6, 4]} intensity={dark ? 1.2 : 1.6} color="#FFF6E8" />
      <directionalLight position={[-4, 2, -3]} intensity={0.45} color="#DFE8E4" />
      <directionalLight position={[-2, 3, -5]} intensity={0.5} color="#FFFFFF" />
      <spotLight position={[2.5, 4.5, 4]} angle={0.45} penumbra={1} intensity={0.8} color="#FFF4E4" />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#111214']} />
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[0, 4, 2.5]}
          scale={[6, 3, 1]}
          color="#FFF4E4"
        />
        <Lightformer
          form="rect"
          intensity={1.1}
          position={[-5, 1.2, 1]}
          scale={[2, 5, 1]}
          color="#E7EFE9"
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          position={[5, 0.5, -2]}
          scale={[2, 5, 1]}
          color="#FFFFFF"
        />
        <Lightformer
          form="ring"
          intensity={0.8}
          position={[0, -3, 2]}
          scale={4}
          color="#28B99A"
        />
      </Environment>

      <ContactShadows
        position={[0, -1.32, 0]}
        opacity={dark ? 0.5 : 0.3}
        scale={9}
        blur={2.7}
        far={4}
        resolution={512}
        frames={1}
        color="#0B0C0D"
      />
    </>
  )
}
