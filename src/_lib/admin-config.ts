import { db } from "./prisma";

export async function getSiteConfig() {
  try {
    const configs = await db.siteConfig.findMany();
    const configMap: Record<string, any> = {};
    
    configs.forEach((config: any) => {
      let value: any = config.value;
      
      // Parse value based on type
      switch (config.type) {
        case 'number':
          value = parseFloat(config.value);
          break;
        case 'boolean':
          value = config.value === 'true';
          break;
        case 'color':
        case 'string':
        default:
          value = config.value;
          break;
      }
      
      configMap[config.key] = value;
    });
    
    return configMap;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return {};
  }
}

export async function setSiteConfig(key: string, value: any, type: string = 'string') {
  try {
    const stringValue = typeof value === 'string' ? value : String(value);
    
    const config = await db.siteConfig.upsert({
      where: { key },
      update: { 
        value: stringValue,
        type,
        updatedAt: new Date()
      },
      create: {
        key,
        value: stringValue,
        type
      }
    });
    
    return config;
  } catch (error) {
    console.error('Erro ao salvar configuração:', error);
    throw error;
  }
}

export async function setMultipleSiteConfigs(configs: Record<string, { value: any; type?: string }>) {
  try {
    const promises = Object.entries(configs).map(([key, { value, type = 'string' }]) =>
      setSiteConfig(key, value, type)
    );
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Erro ao salvar múltiplas configurações:', error);
    throw error;
  }
}

// Função para inicializar configurações padrão
export async function initializeDefaultConfigs() {
  const defaultConfigs = {
    'primary-color': { value: '#7f00e6', type: 'color' },
    'secondary-color': { value: '#7f00e6', type: 'color' },
    'accent-color': { value: '#7f00e6', type: 'color' },
    'background-color': { value: '#101828', type: 'color' },
    'foreground-color': { value: '#ffffff', type: 'color' },
    'muted-color': { value: '#1f2937', type: 'color' },
    'muted-foreground-color': { value: '#9ca3af', type: 'color' },
    'border-color': { value: '#374151', type: 'color' },
    'card-color': { value: '#101828', type: 'color' },
    'card-foreground-color': { value: '#ffffff', type: 'color' }
  };
  
  try {
    await setMultipleSiteConfigs(defaultConfigs);
    return true;
  } catch (error) {
    console.error('Erro ao inicializar configurações padrão:', error);
    throw error;
  }
}
