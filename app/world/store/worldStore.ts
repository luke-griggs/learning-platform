import { create } from 'zustand'
import type { CameraState, RenderableEntity, RenderLayer } from '../types'

interface WorldState {
  camera: CameraState
  entities: Map<string, RenderableEntity>
  isPaused: boolean

  // Camera actions
  setCameraPosition: (x: number, y: number) => void
  setCameraZoom: (zoom: number) => void

  // Entity registry for external systems (trees, trails, companion)
  registerEntity: (entity: RenderableEntity) => void
  unregisterEntity: (id: string) => void
  getEntitiesByLayer: (layer: RenderLayer) => RenderableEntity[]

  // Game state
  setPaused: (paused: boolean) => void
}

export const useWorldStore = create<WorldState>((set, get) => ({
  camera: { x: 0, y: 0, zoom: 1 },
  entities: new Map(),
  isPaused: false,

  setCameraPosition: (x, y) => {
    set({ camera: { ...get().camera, x, y } })
  },

  setCameraZoom: (zoom) => {
    set({ camera: { ...get().camera, zoom } })
  },

  registerEntity: (entity) => {
    set((state) => {
      const newEntities = new Map(state.entities)
      newEntities.set(entity.id, entity)
      return { entities: newEntities }
    })
  },

  unregisterEntity: (id) => {
    set((state) => {
      const newEntities = new Map(state.entities)
      newEntities.delete(id)
      return { entities: newEntities }
    })
  },

  getEntitiesByLayer: (layer) => {
    const entities: RenderableEntity[] = []
    get().entities.forEach((entity) => {
      if (entity.layer === layer) entities.push(entity)
    })
    return entities
  },

  setPaused: (paused) => set({ isPaused: paused }),
}))
