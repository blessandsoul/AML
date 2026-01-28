// Barrel exports for locations feature
export { locationService } from './services/location.service';
export {
  useLocations,
  useLocation,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
} from './hooks/useLocations';
export { EditLocationDialog } from './components/EditLocationDialog';
export type * from './types/location.types';
