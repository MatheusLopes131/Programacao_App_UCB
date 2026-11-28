import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function pedirPermissaoNotificacao() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') return false;

    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('medicamentos', {
          name: 'Lembretes de Medicação',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6C63FF',
          sound: 'default',
        });
      } catch (error) {
        console.warn("Canal já existe ou erro ignorado:", error.message);
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

// Função para cancelar TUDO antes de agendar
async function cancelarTodasAsNotificacoes() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn("Erro ao cancelar todas:", error);
  }
}

export async function agendarNotificacaoMedicamento(medicamento) {
  // 1. Limpa TUDO antes de agendar para evitar notificações duplicadas
  await cancelarTodasAsNotificacoes();

  if (medicamento.tipo === 'SOS' || !medicamento.diasSemana || !medicamento.horarios) return;

  const mapaDias = [1, 2, 3, 4, 5, 6, 1]; 

  for (const horaStr of medicamento.horarios) {
    const [horas, minutos] = horaStr.split(':').map(Number);
    
    for (const dia of medicamento.diasSemana) {
      const diaSemanaExpo = mapaDias[dia];

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⏰ Hora de tomar seu remédio! 😊`,
            body: `${medicamento.nome}`,
            data: { medicamentoId: medicamento.id },
          },
          trigger: {
            channelId: 'medicamentos',
            hour: horas,
            minute: minutos,
            repeats: true,
            weekday: diaSemanaExpo,
          },
        });
      } catch (error) {
        console.warn("Erro ao agendar:", error);
      }
    }
  }
}

export async function cancelarNotificacoesDoMedicamento(medicamentoId) {
  try {
    const agendadas = await Notifications.getAllScheduledNotificationsAsync();
    for (const notificacao of agendadas) {
      if (notificacao.content.data?.medicamentoId === medicamentoId) {
        await Notifications.cancelScheduledNotificationAsync(notificacao.identifier);
      }
    }
  } catch (error) {
    console.warn("Erro ao cancelar:", error);
  }
}