export default class CompatibilityFilters {
  // * ram
  n_ram_slots: number = 4;
  ram_type: string | null = null;
  cpu_ram_type: string | null = null;
  mb_ram_type: string | null = null;
  mb_max_ram_volume: number | null = null;
  cpu_max_ram_volume: number | null = null;
  total_ram_volume: number = 0;
  ram_frequency: number | null = null;
  mb_ram_frequency: string | null = null;

  // * cpu
  mb_socket: string | null = null;
  cpu_socket: string | null = null;

  // * диски
  n_drive_bay_2_5: number = 4;
  n_drive_bay_3_5: number = 4;
  n_m2_slots: number = 1;
  n_sata: number | null = null;
  occupied_2_5: number = 0;
  occupied_3_5: number = 0;
  occupied_m2: number = 0;
  occupied_sata: number = 0;
  m2_size: string | null = null;

  // * mb
  mb_ports: string | null = null;
  integrated_cpu: boolean = false;
  mb_form_factor: string | null = null;
  case_supported_motherboards: string | null = null;

  // * gpu
  n_expansion_slots: number | null = null;
  mb_integrated_gpu_support: string | null = null;
  cpu_integrated_graphics: string | null = null;
  gpu_dimensions: string | null = null;
  max_gpu_length: number | null = null;
  mb_has_pci_e: boolean = true;
  gpu_is_set: boolean = false;

  // * psu
  psu_dimensions: string | null = null;
  max_psu_length: number | null = null;
  min_psu_power: number | null = null;
  psu_power: number | null = null;
  psu_sata: number | null = null;
  mb_connectors: string | null = null;
  psu_mb_connector: string | null = null;
  psu_cpu_connector: string | null = null;
  psu_gpu_connectors: string | null = null;
  gpu_connector: string | null = null;
}
