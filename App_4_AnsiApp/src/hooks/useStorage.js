import AsyncStorage from '@react-native-async-storage/async-storage';

export async function salvarDados(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (e) {
    console.warn('Erro ao salvar', chave, e);
  }
}

export async function carregarDados(chave) {
  try {
    const json = await AsyncStorage.getItem(chave);
    return json != null ? JSON.parse(json) : null;
  } catch (e) {
    console.warn('Erro ao carregar', chave, e);
    return null;
  }
}