# Portfolio OS — Harness de Orquestación

Sistema multi-agente para el rediseño completo del portfolio **danigpascual.dev**
(concepto Omarchy: moderno + cyberpunk + retro, con backend FastAPI).

## Roles

| Rol | Agente | Modelo | Función |
|---|---|---|---|
| **Orquestador** (coordinador) | pi (sesión principal) | glm5.3-flash | Planifica, crea tickets Linear, lanza workers, crea PRs, duerme/despierta |
| **Builder** | worker pi | `nan/deepseek-v4-flash` (medium) | Implementa código en su feature branch |
| **Reviewer** | worker pi | `nan/mimo-v2.6-flash` (medium) | Revisa arquitectura, código, diseño y seguridad |

## Norma de oro

**Máximo 3 agentes simultáneos contando al orquestador.** Es decir: como mucho
2 builders/reviewers activos a la vez. El orquestador solo lanza un nuevo worker
cuando ha liberado un slot (worker settlement + release/retain decidido).

## Flujo por tarea

```
Linear: Todo ──► In Progress ──► In Review ──► Done
                  (builder)      (reviewer +    (review OK +
                                  PR abierta)    PR esperando al usuario)
```

1. El orquestador crea el ticket en Linear (proyecto **PorfoliOS**) con la spec completa.
2. Lanza un builder (`worker-start`) en un child worktree basado en `develop`,
   con rama `feature/T<n>-<slug>`. El ticket pasa a **In Progress**.
3. El builder documenta avances como comentarios en el ticket Linear.
4. Al terminar (`worker_done`), el builder hace push de su rama (nunca merge).
5. El orquestador lanza un reviewer sobre la rama. El ticket pasa a **In Review**.
6. Si el reviewer encuentra problemas → fixes al mismo builder (reuso de terminal).
7. Si el review es OK → el orquestador crea la **PR hacia `develop`** con resumen,
   la adjunta al ticket y lo pasa a **Done**. El usuario aprueba manualmente el merge.

## Gitflow

- `main` — producción (solo merges de release).
- `develop` — integración. Todas las PR van aquí.
- `feature/T<n>-<slug>` — una por tarea, creada desde `develop`.
- Convención de commits: `feat(t<n>):`, `fix(t<n>):`, `chore(t<n>):`, `refactor(t<n>):`.

## Modelos y lanzamiento

```bash
orca orchestration worker-start --task <task_id> \
  --worktree new-child --base-branch develop --repo <selector> \
  --agent pi --model nan/deepseek-v4-flash --effort medium --json
```

Siempre comparar `launch.requested` vs `launch.effective` en el receipt:
nunca asumir que el modelo fue aplicado si `effective` no lo confirma.

## Protocolo de espera del orquestador

- `check --wait` con timeout por ciclo.
- **3 min** de intervalo entre despertares, hasta 3 despertares sin nada que hacer.
- Tras 3 despertares vacíos → subir intervalo a **5 min** (nunca más).
- En cuanto haya trabajo → volver a 3 min con hasta 3 reintentos.
- Tras 3 waits vacíos consecutivos: `worker-list` para enumerar estados en vez de esperar a ciegas.

## Referencias

- [plan.md](./plan.md) — plan maestro de tickets (T0–T5), dependencias y waves.
- [orchestrator.md](./orchestrator.md) — protocolo detallado del coordinador.
- [builder-guide.md](./builder-guide.md) — reglas para los builders.
- [reviewer-guide.md](./reviewer-guide.md) — checklist y veredicto de los reviewers.
