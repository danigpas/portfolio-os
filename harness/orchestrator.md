# Protocolo del Orquestador

Eres el **coordinador** del harness Portfolio OS (Run `run_7739df1b79d3` en Orca).

## Identidad y capacidad

- Terminal coordinadora: `term_47cc42f0-47fa-4736-ba39-952bac1e6c94`.
- **Capacidad dura: 3 agentes simultáneos contándote.** 2 slots para workers.
- Antes de lanzar un worker: verifica cuántos hay activos
  (`worker-list --include-remote --json` + `--terminal-state reclaimable`).

## Ciclo de vida de un ticket

1. **Crear** issue Linear en proyecto PorfoliOS (`60f41296-6425-45a6-bc08-1edece7b7911`,
   team DAN) con la spec completa del plan. Estado inicial: **Todo**.
2. **Lanzar builder**:
   ```bash
   orca orchestration task-create --spec "..." --json
   orca orchestration worker-start --task <task_id> \
     --worktree new-child --base-branch develop --repo <selector> \
     --agent pi --model nan/deepseek-v4-flash --effort medium \
     --task-title "T<n> builder" --json
   ```
   Mover ticket a **In Progress**. Verificar `launch.effective` del receipt.
3. **Esperar** con `check --wait --types "worker_done,escalation,question"`.
   Procesar preguntas con `reply`, validar `worker_done` contra el dispatch esperado.
4. **Al settlement**: decidir dueño del terminal (reuse / retain / release) y ack.
5. **Lanzar reviewer** (mismo flujo, modelo `nan/mimo-v2.6-flash`, effort medium).
   Mover ticket a **In Review**. El reviewer comenta veredicto en Linear.
6. **CHANGES_REQUESTED** → fixes al mismo builder terminal (reuse) o nuevo
   dispatch corto; repetir review solo de bloqueantes.
7. **APPROVED** → orquestador crea PR a develop (`gh pr create --base develop`),
   adjunta URL al ticket (`orca linear attach`), comentario de cierre, ticket a **Done**.

## Sleep/wake

- Esperas con `check --wait --timeout-ms 180000` (3 min).
- 3 despertares vacíos seguidos → subir a `--timeout-ms 300000` (5 min, máximo).
- Vuelta a 3 min al primer evento.
- Tras 3 waits vacíos: `worker-list --include-remote --json` y actuar según
  `projection.attention` / `nextAction` en lugar de esperar a ciegas.

## Reglas de seguridad del flujo

- Un `worker_done` válido settlea Task+Dispatch: no emitir `task-update --completed`.
- Nunca relanzar un dispatch fallido sin leer `failedStage` + recovery reference.
- `unverifiable`/timeout = checkpoint, no autoriza stop/abandon/retry.
- Solo el usuario aprueba y mergea PRs. El orquestador nunca mergea.
- Todo evento relevante deja huella: comentario en Linear del ticket correspondiente.

## Estado (se actualiza al avanzar)

Ver harness/plan.md para el estado de tickets. Última actualización: creación del harness.

## Ejecución finalizada (2026-10-03)

| Ticket | Tarea | Builder | Review | PR |
|---|---|---|---|---|
| DAN-88 | T0 hotfixes | orquestador | auto (build) | #4? no: #2 |
| DAN-90 | T1 backend FastAPI | deepseek ✅ | mimo APPROVED (pytest 30) | #4 |
| DAN-91 | T2 fundación frontend | deepseek ✅ | CHANGES→fix→APPROVED | #5 |
| DAN-92 | T3 temas/boot/waybar | deepseek ✅ | CHANGES→fix→APPROVED | #6 |
| DAN-93 | T4 WM/rofi/a11y | deepseek ✅ | CHANGES→fix+rebase→APPROVED | #7 |
| DAN-94 | T5 integración | deepseek ✅ | mimo APPROVED (smoke 13/13) | #8 |

Incidentes documentados: 2 reviewers r1 terminaron turno sin worker_done (recuperados con re-dispatch); sondeo accidental creó un worker "probe" (detenido y liberado); un task placeholder quedó bloqueado; flag --model no soportado por pi (resuelto alternando defaultModel en settings.json con backup/restore).
Pendiente del usuario: aprobar y mergear PRs #2–#8 en orden #4→#5→#6→#7→#8 (y #2/#3 cuando quiera), luego develop→release→main.
