export function calcularNivel(pontos: number) {
  if (pontos >= 1000) {
    return {
      nivel: 5,
      nome: "Lenda da hidratação",
    };
  }

  if (pontos >= 500) {
    return {
      nivel: 4,
      nome: "Mestre da hidratação",
    };
  }

  if (pontos >= 250) {
    return {
      nivel: 3,
      nome: "Hidratação avançada",
    };
  }

  if (pontos >= 100) {
    return {
      nivel: 2,
      nome: "Hidratado",
    };
  }

  return {
    nivel: 1,
    nome: "Iniciante",
  };
}