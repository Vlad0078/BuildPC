import { ComponentType } from "../models/component_types";

/**
 * ключ - назва характеристики, що використовується в коді
 *
 * значення - назва характеристики, відображена користувачу
 */
type SpecNames = { [name: string]: string };

interface classifiedSpecNames {
  string_spec_names?: SpecNames;
  int_spec_names?: SpecNames;
  float_spec_names?: SpecNames;
  freq_spec_names?: SpecNames;
  bool_spec_names?: SpecNames;
  other_spec_names?: SpecNames;
}

export const specNames: Record<ComponentType, classifiedSpecNames> = {
  [ComponentType.MOTHERBOARD]: {
    string_spec_names: {
      socket: "Сокет",
      cpu_support: "Підтримка процесорів",
      expansion_slots: "Слоти розширення",
      chipset: "Модель чіпсета",
      ram_type: "Тип оперативної пам'яті",
      ram_frequency: "Частота оперативної пам'яті",
      integrated_gpu_support: "Вбудоване відео",
      audio_controller: "Аудіоконтролер",
      multi_channel_sound: "Багатоканальний звук",
      lan_card_type: "Тип мережевої карти",
      external_ports: "Зовнішні порти",
      internal_ports: "Внутрішні роз'єми і порти",
      power_connector: "Конектор живлення",
      other_connectors: "Інші коннектори",
      bios: "Тип BIOS",
      raid: "Контролер RAID",
      os: "Підтримка ОС",
      form_factor: "Форм-фактор",
      manufacturer: "Виробник",
      model: "Модель",
    },
    int_spec_names: {
      ram_slots: "Кількість роз'ємів оперативної пам'яті",
      max_total_ram: "Максимальний об'єм оперативної пам'яті",
      lan_ports: "Кількість LAN портів",
      fan_4pin: "4-pin для вентилятора",
      height: "Висота, мм",
      width: "Ширина, мм",
    },
    bool_spec_names: {
      dual_channel_support: "Підтримка двоканального режиму",
      ecc_support: "Підтримка ECC",
    },
    other_spec_names: {
      lan_speed: "Швидкість LAN портів",
    },
  },

  [ComponentType.CPU]: {
    string_spec_names: {
      core_family: "Сімейство процесора",
      socket: "Сокет",
      cash_memory: "Кеш-пам'ять",
      l1_cash: "Об'єм кеш-пам'яті 1-го рівня",
      l2_cash: "Об'єм кеш-пам'яті 2-го рівня",
      l3_cash: "Об'єм кеш-пам'яті 3-го рівня",
      ram_type: "Тип оперативной пам'яті",
      integrated_graphics: "Графічне ядро",
      intel_generation: "Покоління процесорів Intel",
      amd_architecture: "Архітектура ядра AMD",
      release_date: "Дата виходу",
      packaging_type: "Тип поставки",
      manufacturer: "Виробник",
      model: "Модель",
    },
    int_spec_names: {
      cores: "Кількість ядер",
      threads: "Кількість потоків",
      max_tdp: "Максимальний TDP",
      techprocess: "Техпроцес",
      max_total_ram: "Максимальний обсяг оперативной пам'яті",
      max_ram_frequency: "Максимальна швидкодія пам'яті",
      memory_channels: "Кількість каналів пам'яті",
      max_temperature: "Максимально допустима температура",
    },
    float_spec_names: {
      max_memory_bandwidth: "Максимальна пропускна здатність пам'яті",
      pci_express_v: "Версія PCI express",
    },
    freq_spec_names: {
      base_frequency: "Базова тактова частота процесора",
      max_frequency: "Максимальна тактова частота процесора",
      base_graphics_frequency: "Базова частота графічного процесора",
      max_graphics_frequency: "Максимальна частота графічного процесора",
    },
    bool_spec_names: {
      unlocked_multiplier: "Розблокований множник",
    },
    other_spec_names: {
      has_cooler: "Охолодження в комплекті",
    },
  },

  [ComponentType.GPU]: {
    string_spec_names: {
      graphics_family: "Сімейство графіки",
      graphics_chip: "Графічний чіп",
      connection_interface: "Інтерфейс",
      memory_type: "Тип пам'яті",
      max_resolution: "Максимальна роздільна здатність",
      video_ports: "Роз'єми",
      cooling_system_type: "Тип системи охолодження",
      cooling_type: "Вид охолодження",
      additional_power_connectors: "Роз'єми додаткового живлення",
      directx: "Версія DirectX",
      opengl: "Версія OpenGL",
      dimensions: "Розміри",
      manufacturer: "Виробник",
      model: "Модель",
    },
    int_spec_names: {
      memory: "Об'єм вбудованої пам'яті",
      memory_bus_width: "Розрядність шини пам'яті",
      techprocess: "Техпроцес",
      fans: "Кількість вентиляторів",
      max_power_consumption: "Максимальна споживана потужність",
      min_psu_power: "Мінімальна рекомендована потужність блоку живлення",
    },
    freq_spec_names: {
      core_freq_base: "Частота ядра (Base)",
      core_freq_boost: "Частота ядра (Boost)",
      memory_frequency: "Частота пам'яті",
    },
  },

  [ComponentType.RAM]: {
    string_spec_names: {
      ram_type: "Тип пам'яті",
      standards: "Стандарти пам'яті",
      timings: "Таймінги",
      form_factor: "Форм-фактор пам'яті",
      manufacturer: "Виробник",
      model: "Модель",
    },
    int_spec_names: {
      volume: "Об'єм пам'яті",
      modules: "Кількість модулів у наборі",
    },
    float_spec_names: {
      voltage: "Напруга живлення",
    },
    freq_spec_names: {
      frequency: "Частота пам'яті",
    },
    bool_spec_names: {
      cooling: "Охолодження",
      backlight: "Підсвічування",
      ecc: "Перевірка і корекція помилок (ECC)",
    },
  },

  [ComponentType.SSD]: {
    string_spec_names: {
      storage_type: "Тип накопичувача",
      series: "Серія",
      flash_memory_type: "Тип флеш-пам'яті",
      m2_size: "Типорозмір М2",
      form_factor: "Форм-фактор",
      connection_interface: "Інтерфейс підключення",
      lifetime: "Напрацювання на відмову",
      dimensions: "Габарити",
      manufacturer: "Виробник",
      model: "Модель",
    },
    int_spec_names: {
      read_speed: "Швидкість читання",
      write_speed: "Швидкість запису",
    },
    other_spec_names: {
      volume: "Об'єм пам'яті",
      power_consumption: "Енергоспоживання",
    },
  },

  [ComponentType.HDD]: {
    string_spec_names: {
      spin_rate: "Швидкість обертання шпинделя",
      connection_interface: "Інтерфейс",
      form_factor: "Форм-фактор",
      series: "Лінійка (Серія)",
      manufacturer: "Виробник",
      model: "Модель",
    },
    int_spec_names: {
      buffer_size: "Розмір буферу",
      data_speed: "Швидкість передачі даних",
      noise_level: "Рівень шуму",
    },
    other_spec_names: {
      volume: "Об’єм",
    },
  },

  [ComponentType.POWER_SUPPLY]: {
    string_spec_names: {
      cable_module_connection: "Модульне підключення кабелів",
      certification_80_plus: "Сертифікація 80 PLUS",
      pfc_module: "Модуль PFC",
      motherboard_connection: "Підключення материнскої плати",
      processor_connection: "Підключення процесора",
      gpu_connection: "Підключення відеокарти",
      cooling_type: "Тип охолодження",
      fan_diameters: "Діаметр вентиляторів",
      protection: "Захист від",
      dimensions: "Розмір, мм",
      manufacturer: "Виробник",
      model: "Модель",
    },
    int_spec_names: {
      power: "Потужність",
      n_gpu_connectors: "Кіл-ть роз'ємів додаткового живлення для відеокарт",
      n_sata_connectors: "Кількість роз'ємів SATA",
      n_peripheral_connectors: "Кількість роз'ємів Peripheral",
      n_fdd_connectors: "Кількість роз'ємів FDD",
    },
  },

  [ComponentType.CASE]: {
    string_spec_names: {
      size_type: "Типорозмір",
      installation_type: "Спосіб установки",
      supported_motherboards: "Підтримувані материнські плати",
      series: "Серія",
      psu_plasement: "Розташування блоку живлення",
      places_for_additional_fans: "Місця для додаткових вентиляторів",
      external_connectors: "Зовнішні роз'єми",
      special_features: "Особливості",
      case_matherial: "Матеріал корпусу",
      dimensions: "Розмір, мм",
      color: "Колір",
      manufacturer: "Виробник",
      model: "Модель",
    },
    int_spec_names: {
      psu_power: "Потужність блоку живлення",
      n_drive_bay_3_5: 'Кількіть внутрішніх відсіків 3.5"',
      n_drive_bay_2_5: 'Кількість внутрішніх відсіків 2.5 "',
      n_expansion_slots: "Кількість слотів розширення",
      cooling_elements: "Охолоджуючі елементи",
      max_gpu_length: "Встановлення довгих відеокарт",
      max_cpu_cooler_height: "Максимальна висота процесорного кулера",
      max_psu_length: "Максимальна довжина БЖ",
    },
    float_spec_names: {
      weight: "Вага, кг",
    },
    bool_spec_names: {
      dust_filter: "Пиловий фільтр",
      liquid_cooling_support: "Підтримка рідинного охолодження",
    },
    other_spec_names: {
      has_psu: "Наявність блоку живлення",
    },
  },
};
