import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// ═══════════ THEME ═══════════
const C={bg:'#080808',s1:'#0F0F0F',s2:'#161616',s3:'#1E1E1E',br:'rgba(255,255,255,0.055)',brm:'rgba(255,255,255,0.10)',ac:'#E05520',acd:'rgba(224,85,32,0.12)',ach:'#FF6530',ok:'#18A070',okd:'rgba(24,160,112,0.12)',wn:'#C07B10',t1:'#F0F0F0',t2:'#666',t3:'#343434',pur:'#9B8FEF',gold:'#FFD700'};

// ═══════════ EXERCISE DATABASE ═══════════
// [displayName, primaryMuscle, secondaryMuscle, exerciseDbTerm]
const EX={
PR:['Prensa de Piernas','Cuádriceps','Glúteos · Femorales','leg press'],
HT:['Hip Thrust','Glúteo mayor','Femorales · Core','barbell hip thrust'],
PI:['Press Inclinado MC','Pecho superior','Deltoides ant. · Tríceps','dumbbell incline bench press'],
JP:['Jalón Pecho neutro (straps)','Dorsal ancho','Bíceps · Romboides','lat pulldown'],
RA:['Remo Apoyo Pecho (straps)','Espalda media','Romboides · Trap. medio','chest supported row'],
CF:['Curl Femoral Acostado','Femorales','Isquiotibiales · Glúteo','lying leg curl'],
PM:['Press Militar MC (sentado)','Deltoides frontal','Deltoides lat. · Tríceps','dumbbell shoulder press'],
SM:['SS: Shrugs MC + Flex. Cuello Banda','Trapecio + Cuello','Trap. medio · Esternocleid.','dumbbell shrug'],
SB:['SS: Shrugs Barra + Ext. Cuello Banda','Trapecio + Cuello post.','Trap. medio · Esplenio','barbell shrug'],
SQ:['SS: Shrugs Máquina + Flex. Lat. Cuello','Trapecio + Cuello lat.','Trap. medio · Escalenos','machine shrug'],
SP:['SS: Shrugs Polea + Flex. Cuello Banda','Trapecio + Cuello','Trap. medio · Esternocleid.','cable shrug'],
SS:['SS: Shrugs Smith + Flex. Cuello Banda','Trapecio + Cuello','Trap. medio · Esternocleid.','smith machine shrug'],
AB:['Abducción en Máquina','Glúteo medio','Glúteo menor · TFL','hip abduction machine'],
CM:['Curl Martillo','Braquial · Bíceps','Braquiorradial','dumbbell hammer curl'],
TC:['Ext. Tríceps Polea (cuerda)','Tríceps','Tríceps lateral','cable rope pushdown'],
PP:['Pantorrilla de Pie','Gastrocnemio','Sóleo','standing calf raise'],
PS:['Pantorrilla Sentado','Sóleo','Gastrocnemio','seated calf raise'],
PE:['Pantorrilla en Prensa','Gastrocnemio · Sóleo','Tibial posterior','calf press on leg press'],
PL:['Plancha Frontal','Transverso abd.','Recto abd. · Oblicuos','front plank'],
DB:['Dead Bug','Core · Transverso','Estab. lumbares','dead bug'],
LS:['Plancha Lateral','Oblicuos','Core lateral · Glúteo med.','side plank'],
BD:['Bird Dog','Core · Estabilizadores','Glúteo · Espalda','bird dog'],
SG:['Sentadilla Goblet','Cuádriceps','Glúteos · Core','goblet squat'],
MP:['Press Plano en Máquina','Pecho medio','Tríceps · Deltoides ant.','machine chest press'],
PO:['Pull-Over con MC','Dorsal · Serrato','Pecho · Tríceps largo','dumbbell pullover'],
EL:['Elevación Lateral MC','Deltoides lateral','Trapecio sup.','dumbbell lateral raise'],
EC:['Elevación Lateral Cable','Deltoides lateral','Trapecio sup.','cable lateral raise'],
PG:['Patada Glúteo en Polea','Glúteo mayor','Femorales','cable kickback'],
CP:['Curl Predicador','Bíceps (cab. corta)','Braquial','dumbbell preacher curl'],
PF:['Press Francés','Tríceps (cab. larga)','Tríceps lateral','lying triceps extension'],
HS:['Hack Squat','Cuádriceps','Glúteos · Femorales','hack squat'],
FA:['Fondos Asistidos','Pecho inferior','Tríceps · Deltoides ant.','assisted dip'],
FL:['Fondos Lastrados','Pecho inferior','Tríceps · Deltoides ant.','weighted dip'],
JA:['Jalón Agarre Abierto (straps)','Dorsal ancho','Redondo · Bíceps','wide grip lat pulldown'],
SA:['Straight Arm Pulldown (straps)','Dorsal · Serrato','Romboides · Pecho','cable straight arm pulldown'],
FP:['Face Pull (cuerda)','Deltoides posterior','Trapecio · Manguito rot.','face pull'],
FY:['Face Pull + Y-Raise','Delt. post. + Trap. inf.','Manguito rotador','face pull'],
GT:['Puente de Glúteo','Glúteo mayor','Core · Femorales','glute bridge'],
GL:['Puente Glúteo lastrado','Glúteo mayor','Core · Femorales','weighted glute bridge'],
CI:['Curl Inclinado','Bíceps (cab. larga)','Braquial','dumbbell incline curl'],
FB:['Fondos en Banco','Tríceps (medial)','Pecho inf. · Deltoides','bench dip'],
BG:['Búlgara con MC','Cuádriceps · Glúteo','Femorales · Core','dumbbell bulgarian split squat'],
P1:['Prensa a Una Pierna','Cuádriceps','Glúteo · Femorales','single leg press'],
ZC:['Zancadas Caminando MC','Cuádriceps · Glúteo','Femorales · Estab.','dumbbell walking lunge'],
ZR:['Zancada Reversa MC','Cuádriceps · Glúteo','Femorales · Estab.','dumbbell reverse lunge'],
SU:['Step-Up con MC','Cuádriceps · Glúteo','Estabilizadores · Core','dumbbell step up'],
RU:['Rueda Abdominal','Recto abd. · Core','Serrato · Espalda','ab roller'],
PW:['Plancha con peso','Transverso abd.','Recto abd. · Oblicuos','weighted front plank'],
LE:['Plancha Lateral + elevación','Oblicuos','Core lat. · Glúteo med.','side plank hip lift'],
MH:['Press Máquina Hammer','Pecho medio','Tríceps · Deltoides ant.','machine chest press'],
RH:['Remo Máq. Hammer (straps)','Espalda media/grosor','Romboides · Bíceps · Trap.','lever seated row'],
PA:['Press Arnold Sentado','Deltoides (3 cabezas)','Tríceps · Trapecio','dumbbell arnold press'],
SC:['Sentadilla Sumo Cable','Glúteo · Aductores','Cuádriceps · Core','cable sumo squat'],
CA:['Curl Araña','Bíceps','Braquial','spider curl'],
ES:['Ext. Tríceps Sobre Cabeza','Tríceps (cab. larga)','Tríceps lateral','cable overhead tricep extension'],
CPA:['Curl Polea Alta','Bíceps','Braquial','cable high curl'],
KP:['Kickback en Polea','Tríceps','Tríceps lateral','cable kickback'],
PV:['Pallof Press','Core anti-rotación','Oblicuos · Transverso','pallof press'],
WC:['Woodchop en Polea','Oblicuos · Core rotac.','Transverso · Cadera','cable woodchop'],
AR:['Ab Rollout Pesado','Recto abd. · Core','Serrato · Espalda','ab roller'],
GS:['GS: Patada+Puente+Frog Pump','Glúteo (3 vectores)','Femorales · Core','cable kickback'],
G4:['GS: Abduc+Patada+Puente+Frog','Glúteo (4 vectores)','Femorales · Core','cable kickback'],
PA2:['PRE-AGO: Abduc→Hip Thrust','Glúteo pre-fatigado','Glúteo medio + mayor','barbell hip thrust'],
PA3:['PRE-AGO: Abduc→Hip Thrust lig.','Glúteo pre-fatigado','Glúteo medio + mayor','barbell hip thrust'],
PA4:['PRE-AGO: Abduc→Puente lastrado','Glúteo pre-fatigado','Glúteo medio + mayor','weighted glute bridge'],
PA5:['PRE-AGO: Abduc→Sumo Cable','Glúteo pre-fatigado','Aductores · Cuádr.','cable sumo squat'],
CFS:['Curl Femoral Sentado','Femorales','Isquiotibiales','seated leg curl'],
// SS Brazos
BT1:['SS: Curl Martillo + Ext. Cuerda','Bíceps + Tríceps','Braquial · Tríc. lateral','dumbbell hammer curl'],
BT2:['SS: Curl Predicador + Press Francés','Bíceps + Tríceps','Braquial · Tríc. largo','dumbbell preacher curl'],
BT3:['SS: Curl Inclinado + Fondos Banco','Bíceps + Tríceps','Cab. larga · Medial','dumbbell incline curl'],
BT4:['SS: Curl Araña + Ext. Sobre Cabeza','Bíceps + Tríceps','Braquial · Tríc. largo','spider curl'],
BT5:['SS: Curl Polea Alta + Kickback','Bíceps + Tríceps','Braquial · Tríc. lateral','cable high curl'],
BT6:['SS: Curl Martillo + Fondos Banco','Bíceps + Tríceps','Braquial · Medial','dumbbell hammer curl'],
};

// ═══════════ 14-WEEK PLAN ═══════════
// [exerciseId, sets, reps, rest, technique]
const PLAN=[
// ── WEEK 1 ──
{w:1,ph:'Adaptación',info:'Carga 50-60% | 12-15 reps | 4-5 en reserva',d:[
['Lunes - Full Body A',[['PR',4,'12-15','90s',''],['HT',4,'12-15','90s','Pausa 1s arriba'],['PI',4,'12','75s',''],['JP',4,'12','75s','Straps'],['RA',4,'12','75s','Straps'],['CF',4,'12-15','75s',''],['PM',4,'12','75s','Con respaldo'],['SM',4,'12+15','60s','Pausa 2s shrugs'],['AB',4,'15-20','45s',''],['BT1',4,'12+12','60s',''],['PP',4,'15-20','45s','Pausa 2s abajo'],['PL',4,'30-45s','45s','']]],
['Miércoles - Full Body B',[['SG',4,'12-15','90s','Torso erguido'],['HT',4,'12-15','90s',''],['MP',4,'12','75s',''],['RA',4,'12','75s','Straps'],['PO',4,'12','75s',''],['CF',4,'12-15','75s',''],['EL',4,'15','60s','Peso ligero'],['SB',4,'12+15','60s',''],['PG',4,'15/p','45s','Contracción arriba'],['BT1',4,'12+12','60s',''],['PP',4,'15-20','45s',''],['DB',4,'10/lado','45s','Lumbar al suelo']]],
['Viernes - Full Body C',[['HS',4,'12-15','90s',''],['HT',4,'12-15','90s',''],['FA',4,'10-12','75s',''],['JA',4,'12','75s','Straps'],['SA',4,'12','60s','Contracción total'],['CF',4,'12-15','75s',''],['FP',4,'15','60s','Salud del hombro'],['SQ',4,'12+12/l','60s',''],['GT',4,'20','45s',''],['BT1',4,'12+12','60s',''],['PP',4,'15-20','45s',''],['LS',4,'30s/lado','45s','']]],
]},
// ── WEEK 2 ──
{w:2,ph:'Adaptación',info:'Carga 50-60% | Accesorios rotan',d:[
['Lunes - Full Body A',[['PR',4,'12-15','90s',''],['HT',4,'12-15','90s',''],['MP',4,'12','75s',''],['RA',4,'12','75s','Straps'],['PO',4,'12','75s',''],['CF',4,'12-15','75s',''],['EL',4,'15','60s',''],['SB',4,'12+15','60s',''],['PG',4,'15/p','45s',''],['BT2',4,'12+12','60s',''],['PS',4,'15-20','45s',''],['DB',4,'10/lado','45s','']]],
['Miércoles - Full Body B',[['SG',4,'12-15','90s',''],['HT',4,'12-15','90s',''],['FA',4,'10-12','75s',''],['JP',4,'12','75s','Straps'],['SA',4,'12','60s',''],['CF',4,'12-15','75s',''],['FP',4,'15','60s',''],['SM',4,'12+15','60s',''],['GT',4,'20','45s',''],['BT2',4,'12+12','60s',''],['PS',4,'15-20','45s',''],['LS',4,'30s/lado','45s','']]],
['Viernes - Full Body C',[['HS',4,'12-15','90s',''],['HT',4,'12-15','90s',''],['PI',4,'12','75s',''],['JA',4,'12','75s','Straps'],['RA',4,'12','75s','Straps'],['CF',4,'12-15','75s',''],['PM',4,'12','75s',''],['SP',4,'12+12/l','60s',''],['AB',4,'15-20','45s',''],['BT2',4,'12+12','60s',''],['PP',4,'15-20','45s',''],['BD',4,'10/lado','45s','']]],
]},
// ── WEEK 3 ──
{w:3,ph:'Adaptación',info:'Carga 50-60% | Última semana adaptación',d:[
['Lunes - Full Body A',[['PR',4,'12-15','90s',''],['HT',4,'12-15','90s',''],['FA',4,'10-12','75s',''],['JA',4,'12','75s','Straps'],['PO',4,'12','75s',''],['CF',4,'12-15','75s',''],['FP',4,'15','60s',''],['SQ',4,'12+15','60s',''],['GT',4,'20','45s',''],['BT3',4,'12+12','60s',''],['PP',4,'15-20','45s',''],['LS',4,'30s/lado','45s','']]],
['Miércoles - Full Body B',[['SG',4,'12-15','90s',''],['HT',4,'12-15','90s',''],['PI',4,'12','75s',''],['RA',4,'12','75s','Straps'],['JP',4,'12','75s','Straps'],['CF',4,'12-15','75s',''],['PM',4,'12','75s',''],['SB',4,'12+15','60s',''],['AB',4,'15-20','45s',''],['BT3',4,'12+12','60s',''],['PS',4,'15-20','45s',''],['BD',4,'10/lado','45s','']]],
['Viernes - Full Body C',[['HS',4,'12-15','90s',''],['HT',4,'12-15','90s',''],['MP',4,'12','75s',''],['SA',4,'12','60s',''],['RA',4,'12','75s','Straps'],['CF',4,'12-15','75s',''],['EL',4,'15','60s',''],['SM',4,'12+12/l','60s',''],['PG',4,'15/p','45s',''],['BT3',4,'12+12','60s',''],['PP',4,'15-20','45s',''],['PL',4,'45s','45s','']]],
]},
// ── WEEK 4 ──
{w:4,ph:'Intensificación B1',info:'Carga 70-72% | 8-12 reps | 1-2 en reserva',d:[
['Lunes - Full Body A',[['PR',4,'8-10','90s','Última DROPSET'],['BG',4,'10/p','75s','Tempo 3-1-X'],['HT',4,'8-10','90s','Pausa 2s arriba'],['PI',4,'8-10','75s','Última al fallo'],['JP',4,'8-10','75s','Tempo 3s'],['RA',4,'8-10','75s',''],['PM',4,'8-10','75s',''],['SM',4,'12+15','60s','Pausa 2s'],['CF',4,'10-12','75s','DROPSET última'],['AB',4,'15','45s','REST-PAUSE última'],['BT1',4,'10+10','60s','DROPSET última'],['PP',4,'12-15','45s','Pausa 2s'],['PW',4,'40s','45s','']]],
['Miércoles - Full Body B',[['SG',4,'10-12','90s','Tempo 3-1-X'],['P1',4,'10/p','75s',''],['HT',4,'8-10','90s','Serie tope pesada'],['MP',4,'8-10','75s','Última al fallo'],['RH',4,'8-10','75s','Tempo 3s'],['PO',4,'10-12','75s',''],['EL',4,'12-15','60s','REST-PAUSE última'],['SB',4,'12+15','60s','Pausa 2s'],['CFS',4,'10-12','75s',''],['PG',4,'12/p','45s','Pausa arriba'],['BT2',4,'10+10','60s',''],['PS',4,'12-15','45s',''],['RU',4,'10-12','45s','']]],
['Viernes - Full Body C',[['HS',4,'8-10','90s','Última DROPSET'],['ZC',4,'10/p','75s',''],['HT',4,'8-10','90s','Pausa 2s'],['FL',4,'8-10','75s','Última al fallo'],['JA',4,'8-10','75s','Tempo 3s'],['SA',4,'12','60s',''],['FP',4,'15','60s','REST-PAUSE'],['SQ',4,'12+12/l','60s',''],['CF',4,'10-12','75s',''],['GL',4,'15','45s',''],['BT3',4,'10+12','60s',''],['PP',4,'12-15','45s',''],['LE',4,'12/lado','45s','']]],
]},
// ── WEEK 5 ──
{w:5,ph:'Intensificación B1',info:'Carga 73-75% | 1 en reserva | Dropset x2, Rest-Pause',d:[
['Lunes - Full Body A',[['PR',4,'8-10','90s','Última DROP x2'],['P1',4,'10/p','75s',''],['HT',4,'8-10','90s','Pausa 2s'],['MP',4,'8-10','75s','Fallo + REST-PAUSE'],['RA',4,'8-10','75s','Tempo 3s'],['JP',4,'8-10','75s',''],['EL',4,'12-15','60s','REST-PAUSE última'],['SB',4,'12+15','60s','Pausa 2s'],['CF',4,'10-12','75s','DROPSET última'],['PG',4,'12/p','45s','Pausa arriba'],['BT2',4,'10+10','60s','DROPSET última'],['PS',4,'12-15','45s','Pausa 2s'],['RU',4,'10-12','45s','']]],
['Miércoles - Full Body B',[['SG',4,'10-12','90s','Tempo 3-1-X'],['ZC',4,'10/p','75s','Más peso'],['HT',4,'8-10','90s','Serie tope pesada'],['FL',4,'8-10','75s','Última al fallo'],['SA',4,'12','60s',''],['RH',4,'8-10','75s','Tempo 3s'],['FP',4,'15','60s','REST-PAUSE'],['SQ',4,'12+15','60s',''],['CFS',4,'10-12','75s','DROPSET x2'],['GL',4,'15','45s',''],['BT3',4,'10+12','60s',''],['PP',4,'12-15','45s',''],['LE',4,'12/lado','45s','']]],
['Viernes - Full Body C',[['HS',4,'8-10','90s','Última DROP x2'],['BG',4,'10/p','75s','Tempo 3-1-X más peso'],['HT',4,'8-10','90s','Pausa 2s'],['PI',4,'8-10','75s','Última al fallo'],['JA',4,'8-10','75s','Tempo 3s'],['PO',4,'10-12','75s',''],['PM',4,'8-10','75s','Última al fallo'],['SP',4,'12+12/l','60s',''],['CF',4,'10-12','75s','REST-PAUSE'],['AB',4,'15','45s','REST-PAUSE última'],['BT1',4,'10+10','60s','DROPSET última'],['PS',4,'12-15','45s',''],['PW',4,'45s','45s','']]],
]},
// ── WEEK 6 ──
{w:6,ph:'Pico Bloque 1',info:'Carga 75-78% | 6-8 reps | Fallo en topes',d:[
['Lunes - Full Body A',[['PR',4,'6-8','90s','Aprox+tope fallo+DROP x2'],['ZC',4,'8/p','75s','Peso pesado'],['HT',4,'6-8','90s','Tope máxima+pausa 2s'],['PI',4,'6-8','75s','Fallo+REST-PAUSE'],['JP',4,'6-8','75s','Tempo 4s'],['RA',4,'6-8','75s','Excéntrico 4s'],['FP',4,'15','60s','REST-PAUSE+DROPSET'],['SB',4,'10+15','60s','Peso pesado, pausa 2s'],['CF',4,'8-10','75s','Fallo+DROPSET x2'],['GL',4,'15','45s','DROPSET'],['BT1',4,'8+10','60s','DROPSET última'],['PP',4,'12-15','45s','Pausa 2s+DROPSET'],['PW',4,'50s','45s','']]],
['Miércoles - Full Body B',[['SG',4,'8-10','90s','Tempo 4-1-X'],['BG',4,'8/p','75s','Tempo 4-1-X pesada'],['HT',4,'6-8','90s','Aprox+tope máxima'],['MP',4,'6-8','75s','Fallo+REST-PAUSE'],['RH',4,'6-8','75s','Excéntrico 4s'],['PO',4,'10-12','75s',''],['PM',4,'6-8','75s','Última al fallo'],['SQ',4,'10+15','60s','Peso pesado'],['CFS',4,'8-10','75s','DROP x2+REST-PAUSE'],['AB',4,'15','45s','REST-PAUSE+DROPSET'],['BT2',4,'8+10','60s','REST-PAUSE última'],['PS',4,'12-15','45s','Pausa 2s'],['RU',4,'10-12','45s','']]],
['Viernes - Full Body C',[['HS',4,'6-8','90s','Aprox+tope fallo+DROP x2'],['P1',4,'8/p','75s','Tempo excéntrico'],['HT',4,'6-8','90s','Serie tope máxima'],['FL',4,'6-8','75s','Fallo+REST-PAUSE'],['JA',4,'6-8','75s','Excéntrico 4s'],['SA',4,'10','60s','DROPSET x2'],['EL',4,'12-15','60s','REST-PAUSE+DROPSET'],['SP',4,'10+12/l','60s','Peso pesado'],['CF',4,'8-10','75s','Fallo+DROPSET x2'],['PG',4,'12/p','45s','Pausa arriba'],['BT3',4,'10+12','60s','DROP x2 última'],['PP',4,'12-15','45s','DROPSET'],['LE',4,'12/lado','45s','']]],
]},
// ── WEEK 7 DELOAD ──
{w:7,ph:'DELOAD',info:'Carga 50-60% | 2 series | Sin técnicas | Sin fallo',d:[
['Lunes - Full Body A',[['PR',2,'12','90s','Suave'],['BG',2,'12/p','75s',''],['HT',2,'12','90s',''],['PI',2,'12','75s',''],['JP',2,'12','75s',''],['RA',2,'12','75s',''],['PM',2,'12','75s',''],['SM',2,'12+15','60s',''],['CF',2,'12','75s',''],['AB',2,'15','45s',''],['BT1',2,'12+12','60s',''],['PP',2,'15','45s',''],['PL',2,'30s','45s','']]],
['Miércoles - Full Body B',[['SG',2,'12','90s','Suave'],['ZC',2,'12/p','75s',''],['HT',2,'12','90s',''],['MP',2,'12','75s',''],['RH',2,'12','75s',''],['PO',2,'12','75s',''],['EL',2,'15','60s',''],['SB',2,'12+15','60s',''],['CFS',2,'12','75s',''],['PG',2,'12/p','45s',''],['BT2',2,'12+12','60s',''],['PS',2,'15','45s',''],['DB',2,'10/lado','45s','']]],
['Viernes - Full Body C',[['HS',2,'12','90s','Suave'],['P1',2,'12/p','75s',''],['HT',2,'12','90s',''],['FA',2,'12','75s',''],['JA',2,'12','75s',''],['SA',2,'12','60s',''],['FP',2,'15','60s',''],['SQ',2,'12+12/l','60s',''],['CF',2,'12','75s',''],['GT',2,'15','45s',''],['BT3',2,'12+12','60s',''],['PP',2,'15','45s',''],['LS',2,'30s/lado','45s','']]],
]},
// ── WEEK 8 ──
{w:8,ph:'Intensificación B2',info:'Carga 70-72% | Cluster, Pre-ago, Series Gigantes',d:[
['Lunes - Full Body A',[['PR',4,'8-10','90s','CLUSTER última'],['SU',4,'10/p','75s','Controlado'],['HT',4,'8-10','90s','Pausa 2s'],['PI',4,'8-10','75s','MDS: inclinado→plano'],['JP',4,'8-10','75s','Tempo 3s'],['RH',4,'8-10','75s',''],['EC',4,'12-15','60s','REST-PAUSE última'],['SS',4,'12+15','60s','Pausa 2s'],['CF',4,'10-12','75s','DROPSET última'],['PA3',4,'15+12','60s','Pre-agotamiento'],['BT4',4,'10+10','60s',''],['PE',4,'12-15','45s','Pausa 2s'],['PV',4,'12/lado','45s','']]],
['Miércoles - Full Body B',[['SG',4,'10-12','90s','Tempo 3-1-X'],['ZR',4,'10/p','75s','Controlado'],['HT',4,'8-10','90s','Serie tope pesada'],['MH',4,'8-10','75s','Última al fallo'],['RA',4,'8-10','75s','Tempo 3s'],['PO',4,'10-12','75s',''],['PA',4,'10','75s',''],['SP',4,'12+15','60s',''],['CFS',4,'10-12','75s',''],['SC',4,'15','60s','Aprieta glúteo'],['BT5',4,'10+10','60s',''],['PS',4,'12-15','45s',''],['WC',4,'12/lado','45s','']]],
['Viernes - Full Body C',[['HS',4,'8-10','90s','CLUSTER última'],['BG',4,'10/p','75s','Tempo 3-1-X'],['HT',4,'8-10','90s','Pausa 2s'],['FL',4,'8-10','75s','Última al fallo'],['JA',4,'8-10','75s',''],['SA',4,'12','60s','Contracción total'],['FY',4,'12+8','60s','Combinación'],['SM',4,'12+12/l','60s','Pausa 2s'],['CF',4,'10-12','75s','DROPSET'],['GS',4,'10+12+15','75s','Serie Gigante'],['BT6',4,'10+12','60s',''],['PP',4,'12-15','45s',''],['AR',4,'10-12','45s','']]],
]},
// ── WEEK 9 ──
{w:9,ph:'Intensificación B2',info:'Carga 73-75% | 1 en reserva | Técnicas agresivas',d:[
['Lunes - Full Body A',[['PR',4,'8-10','90s','CLUSTER+DROPSET'],['ZR',4,'10/p','75s','Más peso'],['HT',4,'8-10','90s','Serie tope pesada'],['MH',4,'8-10','75s','Fallo+REST-PAUSE'],['RH',4,'8-10','75s','Tempo 3s'],['RA',4,'8-10','75s',''],['PA',4,'10','75s','DROPSET última'],['SP',4,'12+15','60s','Pausa 2s'],['CF',4,'10-12','75s','DROPSET x2'],['SC',4,'15','60s','REST-PAUSE última'],['BT5',4,'10+10','60s','DROPSET última'],['PS',4,'12-15','45s','Pausa 2s'],['WC',4,'12/lado','45s','']]],
['Miércoles - Full Body B',[['SG',4,'10-12','90s','Tempo 3-1-X'],['BG',4,'10/p','75s','Más peso'],['PA2',4,'15+8-10','90s','Pre-agotamiento'],['FL',4,'8-10','75s','Última al fallo'],['JP',4,'8-10','75s',''],['SA',4,'12','60s','DROPSET última'],['EC',4,'12-15','60s','REST-PAUSE última'],['SM',4,'12+15','60s',''],['CFS',4,'10-12','75s','DROPSET'],['GS',4,'10+12+15','75s','Serie Gigante'],['BT4',4,'10+10','60s',''],['PP',4,'12-15','45s',''],['PV',4,'12/lado','45s','']]],
['Viernes - Full Body C',[['HS',4,'8-10','90s','CLUSTER+DROPSET'],['SU',4,'10/p','75s','Peso pesado'],['HT',4,'8-10','90s','Pausa 2s+REST-PAUSE'],['PI',4,'8-10','75s','MDS: inclinado→plano'],['JA',4,'8-10','75s','Tempo 3s'],['RA',4,'8-10','75s',''],['FY',4,'12+8','60s','REST-PAUSE'],['SS',4,'12+12/l','60s','Pausa 2s'],['CF',4,'10-12','75s','REST-PAUSE'],['PA4',4,'15+15','60s',''],['BT6',4,'10+12','60s','DROPSET última'],['PE',4,'12-15','45s','DROPSET'],['AR',4,'10-12','45s','']]],
]},
// ── WEEK 10 ──
{w:10,ph:'Pico Bloque 2',info:'Carga 76-78% | 6-8 reps | Fallo en topes',d:[
['Lunes - Full Body A',[['PR',4,'6-8','90s','CLUSTER fallo+DROP x2'],['BG',4,'8/p','75s','Tempo 4-1-X pesada'],['HT',4,'6-8','90s','Tope máxima+pausa 2s'],['PI',4,'6-8','75s','MDS: incli→plano fallo'],['JP',4,'6-8','75s','Tempo 4s+DROPSET'],['RH',4,'6-8','75s','Excéntrico 4s'],['PA',4,'8','75s','Última al fallo'],['SS',4,'10+15','60s','Peso pesado, pausa 2s'],['CF',4,'8-10','75s','Fallo+DROPSET x2'],['GS',4,'15+10+15','75s','Serie Gigante'],['BT4',4,'8+10','60s','DROPSET última'],['PP',4,'12-15','45s','Pausa 2s+DROPSET'],['PV',4,'12/lado','45s','']]],
['Miércoles - Full Body B',[['SG',4,'8-10','90s','Tempo 4-1-X'],['ZR',4,'8/p','75s','Peso pesado'],['PA2',4,'15+6-8','90s','Tope máxima'],['MH',4,'6-8','75s','Fallo+REST-PAUSE'],['RA',4,'6-8','75s','Excéntrico 4s+DROPSET'],['PO',4,'10-12','75s',''],['EC',4,'12-15','60s','REST-PAUSE+DROPSET'],['SP',4,'10+15','60s','Peso pesado'],['CFS',4,'8-10','75s','DROP x2+REST-PAUSE'],['SC',4,'12','60s','DROPSET'],['BT5',4,'8+10','60s','REST-PAUSE última'],['PS',4,'12-15','45s','Pausa 2s'],['WC',4,'12/lado','45s','']]],
['Viernes - Full Body C',[['HS',4,'6-8','90s','CLUSTER fallo+DROP x2'],['SU',4,'8/p','75s','Pesado'],['HT',4,'6-8','90s','Serie tope máxima'],['FL',4,'6-8','75s','Fallo+REST-PAUSE'],['JA',4,'6-8','75s','Excéntrico 4s+DROPSET'],['SA',4,'10','60s','DROPSET x2'],['FY',4,'12+8','60s','REST-PAUSE+DROPSET'],['SM',4,'10+12/l','60s','Pesado, pausa 2s'],['CF',4,'8-10','75s','Fallo+DROPSET x2'],['GS',4,'10+12+15','75s','Serie Gigante'],['BT6',4,'10+12','60s','DROP x2 última'],['PE',4,'12-15','45s','DROPSET'],['AR',4,'10-12','45s','']]],
]},
// ── WEEK 11 DELOAD ──
{w:11,ph:'DELOAD',info:'Carga 50-60% | 2 series | Sin técnicas',d:[
['Lunes - Full Body A',[['PR',2,'12','90s','Suave'],['SU',2,'12/p','75s',''],['HT',2,'12','90s',''],['PI',2,'12','75s',''],['JP',2,'12','75s',''],['RH',2,'12','75s',''],['EC',2,'15','60s',''],['SM',2,'12+15','60s',''],['CF',2,'12','75s',''],['AB',2,'15','45s',''],['BT4',2,'12+12','60s',''],['PP',2,'15','45s',''],['PV',2,'12/lado','45s','']]],
['Miércoles - Full Body B',[['SG',2,'12','90s','Suave'],['ZR',2,'12/p','75s',''],['HT',2,'12','90s',''],['MH',2,'12','75s',''],['RA',2,'12','75s',''],['PO',2,'12','75s',''],['PA',2,'12','75s',''],['SP',2,'12+15','60s',''],['CFS',2,'12','75s',''],['SC',2,'15','60s',''],['BT5',2,'12+12','60s',''],['PS',2,'15','45s',''],['WC',2,'12/lado','45s','']]],
['Viernes - Full Body C',[['HS',2,'12','90s','Suave'],['BG',2,'12/p','75s',''],['HT',2,'12','90s',''],['FA',2,'12','75s',''],['JA',2,'12','75s',''],['SA',2,'12','60s',''],['FP',2,'15','60s',''],['SQ',2,'12+12/l','60s',''],['CF',2,'12','75s',''],['GT',2,'15','45s',''],['BT6',2,'12+12','60s',''],['PE',2,'15','45s',''],['AR',2,'10','45s','']]],
]},
// ── WEEK 12 ──
{w:12,ph:'Pico Bloque 3',info:'Carga 76-80% | 0-1 en reserva | Todas las técnicas',d:[
['Lunes - Full Body A',[['PR',4,'6-8','90s','CLUSTER fallo+DROP x2'],['BG',4,'8/p','75s','Tempo 4-1-X pesada'],['PA2',4,'15+6-8','90s','Tope máxima'],['PI',4,'6-8','75s','MDS: incli→plano fallo'],['JP',4,'6-8','75s','Tempo 4s+DROPSET'],['RA',4,'6-8','75s','Excéntrico 4s'],['PM',4,'6-8','75s','Última al fallo'],['SS',4,'10+15','60s','Peso pesado, pausa 2s'],['CF',4,'8-10','75s','Fallo+DROPSET x2'],['GS',4,'10+12+15','75s','Serie Gigante'],['BT4',4,'8+10','60s','DROP x2 última'],['PP',4,'10-12','45s','CLUSTER+DROPSET'],['PV',4,'10/lado','45s','']]],
['Miércoles - Full Body B',[['SG',4,'8-10','90s','Tempo 4-1-X pesada'],['SU',4,'8/p','75s','Peso pesado'],['HT',4,'6-8','90s','Aprox+tope máxima'],['MH',4,'6-8','75s','Fallo+REST-PAUSE'],['RH',4,'6-8','75s','Excéntrico 4s+DROPSET'],['PO',4,'10-12','75s',''],['EC',4,'12-15','60s','REST-PAUSE+DROPSET'],['SP',4,'10+15','60s','Pesado'],['CFS',4,'8-10','75s','DROP x2+REST-PAUSE'],['PA5',4,'15+12','60s',''],['BT5',4,'8+10','60s','REST-PAUSE última'],['PS',4,'10-12','45s','Pausa 2s+DROPSET'],['WC',4,'10/lado','45s','']]],
['Viernes - Full Body C',[['HS',4,'6-8','90s','CLUSTER fallo+DROP x2'],['ZR',4,'8/p','75s','Peso pesado'],['HT',4,'6-8','90s','Tope máxima+pausa 2s'],['FL',4,'6-8','75s','Fallo+REST-PAUSE'],['JA',4,'6-8','75s','Excéntrico 4s+DROPSET'],['SA',4,'10','60s','DROPSET x2'],['FY',4,'12+8','60s','REST-PAUSE+DROPSET'],['SM',4,'10+12/l','60s','Pesado, pausa 2s'],['CF',4,'8-10','75s','Fallo+DROP x2'],['G4',4,'12+10+12+15','90s','Serie Gigante x4'],['BT6',4,'8+10','60s','DROPSET x2'],['PE',4,'10-12','45s','DROPSET'],['AR',4,'10','45s','']]],
]},
// ── WEEK 13 ──
{w:13,ph:'Pico Absoluto',info:'Carga 78-82% | 5-6 reps | Fallo absoluto | Máxima exigencia',d:[
['Lunes - Full Body A',[['PR',4,'5-6','120s','CLUSTER doble al fallo'],['SU',4,'8/p','75s','Pesado+tempo 4s'],['PA2',4,'15+5-6','120s','Tope máxima absoluta'],['PI',4,'5-6','90s','MDS al fallo'],['JP',4,'5-6','90s','Excéntrico 4s+DROP x2'],['RH',4,'5-6','90s','Excéntrico 4s'],['PA',4,'6-8','75s','Fallo+REST-PAUSE'],['SS',4,'8+15','60s','Máx peso, pausa 2s'],['CF',4,'8','75s','Fallo+DROP x2+R-P'],['GS',4,'10+12+15','75s','Serie Gigante máx'],['BT4',4,'8+8','60s','DROPSET x2'],['PP',4,'10-12','45s','CLUSTER+DROPSET'],['PV',4,'10/lado','45s','']]],
['Miércoles - Full Body B',[['SG',4,'6-8','90s','Tempo 4-1-X máx peso'],['BG',4,'6/p','75s','Pesada+tempo 4s'],['HT',4,'5-6','120s','Aprox+tope absoluta'],['FL',4,'5-6','90s','Máx lastre+REST-PAUSE'],['RA',4,'5-6','90s','Excéntrico 4s+DROPSET'],['SA',4,'10','60s','DROPSET x2'],['EC',4,'12-15','60s','R-P+DROP x2'],['SP',4,'8+15','60s','Pesado'],['CFS',4,'8','75s','Fallo+DROPSET x2'],['PA5',4,'15+10','60s','REST-PAUSE'],['BT5',4,'8+8','60s','DROP x2 última'],['PS',4,'10-12','45s','DROP+REST-PAUSE'],['WC',4,'10/lado','45s','']]],
['Viernes - Full Body C',[['HS',4,'5-6','120s','CLUSTER doble fallo absoluto'],['ZR',4,'6/p','75s','Máximo peso'],['PA2',4,'15+5-6','120s','Tope absoluta'],['MH',4,'5-6','90s','Fallo+R-P+DROPSET'],['JA',4,'5-6','90s','Excéntrico 4s+DROP x2'],['RA',4,'5-6','90s','Excéntrico 4s'],['FY',4,'12+8','60s','REST-PAUSE+DROPSET'],['SM',4,'8+12/l','60s','Máximo peso'],['CF',4,'8','75s','Fallo+DROP x2+R-P'],['G4',4,'12+10+12+15','90s','Serie Gigante x4'],['BT6',4,'8+10','60s','DROPSET x2'],['PE',4,'10-12','45s','CLUSTER+DROPSET'],['AR',4,'8-10','45s','']]],
]},
// ── WEEK 14 DELOAD ──
{w:14,ph:'DELOAD Final',info:'Carga 50-60% | 2 series | Sin técnicas | Recuperación',d:[
['Lunes - Full Body A',[['PR',2,'12','90s','Suave'],['SU',2,'12/p','75s',''],['HT',2,'12','90s',''],['PI',2,'12','75s',''],['JP',2,'12','75s',''],['RA',2,'12','75s',''],['PM',2,'12','75s',''],['SM',2,'12+15','60s',''],['CF',2,'12','75s',''],['AB',2,'15','45s',''],['BT4',2,'12+12','60s',''],['PP',2,'15','45s',''],['PV',2,'12/lado','45s','']]],
['Miércoles - Full Body B',[['SG',2,'12','90s','Suave'],['ZR',2,'12/p','75s',''],['HT',2,'12','90s',''],['MH',2,'12','75s',''],['RH',2,'12','75s',''],['PO',2,'12','75s',''],['EL',2,'15','60s',''],['SP',2,'12+15','60s',''],['CFS',2,'12','75s',''],['SC',2,'15','60s',''],['BT5',2,'12+12','60s',''],['PS',2,'15','45s',''],['WC',2,'12/lado','45s','']]],
['Viernes - Full Body C',[['HS',2,'12','90s','Suave'],['BG',2,'12/p','75s',''],['HT',2,'12','90s',''],['FA',2,'12','75s',''],['JA',2,'12','75s',''],['SA',2,'12','60s',''],['FP',2,'15','60s',''],['SQ',2,'12+12/l','60s',''],['CF',2,'12','75s',''],['GT',2,'15','45s',''],['BT6',2,'12+12','60s',''],['PE',2,'15','45s',''],['AR',2,'10','45s','']]],
]},
];

const GOALS={cal:2400,prot:158,carbs:280,fat:71};
const MFIELDS=[{id:'cintura',l:'Cintura'},{id:'pecho',l:'Pecho'},{id:'brazoD',l:'Bícep der.'},{id:'brazoI',l:'Bícep izq.'},{id:'muslo',l:'Muslo'},{id:'cadera',l:'Cadera'},{id:'cuello',l:'Cuello'}];
const API_KEY='af7754f17bmshc95f932574bacd6p142395jsnc602e7e85e2a';
const API_HOST='exercisedb.p.rapidapi.com';

// ═══════════ STORAGE ═══════════
const load=async(k)=>{try{const r=await window.storage.get(k);return r?JSON.parse(r.value):null}catch(e){return null}};
const save=async(k,v)=>{try{await window.storage.set(k,JSON.stringify(v))}catch(e){}};

// ═══════════ EXERCISEDB API ═══════════
const gifCache={};
async function fetchGif(exId){
  if(gifCache[exId])return gifCache[exId];
  const cached=await load('gif_'+exId);
  if(cached){gifCache[exId]=cached;return cached;}
  const term=EX[exId]?.[3];
  if(!term)return null;
  try{
    const r=await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(term)}?limit=1`,{headers:{'X-RapidAPI-Key':API_KEY,'X-RapidAPI-Host':API_HOST}});
    const d=await r.json();
    if(d&&d[0]&&d[0].gifUrl){gifCache[exId]=d[0].gifUrl;await save('gif_'+exId,d[0].gifUrl);return d[0].gifUrl;}
  }catch(e){}
  return null;
}

// ═══════════ COMPONENTS ═══════════
const sty={page:{background:C.bg,minHeight:'100vh',fontFamily:'-apple-system,system-ui,sans-serif',color:C.t1},hdr:{padding:'12px 16px',borderBottom:`0.5px solid ${C.br}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:C.s1,position:'sticky',top:0,zIndex:20},wrap:{padding:'14px 14px 80px',maxWidth:660,margin:'0 auto'},card:{background:C.s2,borderRadius:12,border:`0.5px solid ${C.br}`,padding:'12px 13px'},btn:{background:C.ac,color:'#fff',border:'none',borderRadius:10,padding:'11px 15px',fontSize:15,fontWeight:600,cursor:'pointer',width:'100%',textAlign:'center',fontFamily:'inherit'},bts:{background:'transparent',color:C.t2,border:`0.5px solid ${C.brm}`,borderRadius:10,padding:'9px 13px',fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:'inherit'},inp:{background:C.s3,border:`0.5px solid ${C.br}`,borderRadius:8,padding:'7px 9px',color:C.t1,fontSize:14,outline:'none',boxSizing:'border-box',fontFamily:'inherit',width:'100%'}};
const pill=(c)=>({display:'inline-flex',padding:'2px 7px',borderRadius:5,fontSize:11,fontWeight:600,background:c+'22',color:c});

function Stat({l,v,c}){return<div style={{background:C.s1,borderRadius:10,padding:'10px 7px',textAlign:'center',border:`0.5px solid ${C.br}`,flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:700,color:c||C.t1}}>{v}</div><div style={{fontSize:10,color:C.t3,marginTop:3}}>{l}</div></div>}

function BottomNav({a,set}){
  const tabs=[{id:'home',l:'Hoy',i:'🏠'},{id:'progress',l:'Progreso',i:'📊'},{id:'nutrition',l:'Nutrición',i:'🥗'}];
  return<div style={{position:'fixed',bottom:0,left:0,right:0,background:C.s1,borderTop:`0.5px solid ${C.br}`,display:'flex',zIndex:50}}>{tabs.map(t=>{const on=a===t.id||(t.id==='home'&&(a==='home'||a==='plan'));return<button key={t.id} onClick={()=>set(t.id)} style={{flex:1,background:'transparent',border:'none',cursor:'pointer',padding:'9px 0',display:'flex',flexDirection:'column',alignItems:'center',gap:2,fontFamily:'inherit'}}><span style={{fontSize:17}}>{t.i}</span><span style={{fontSize:10,fontWeight:600,color:on?C.ac:C.t3}}>{t.l}</span></button>})}</div>
}

function ExGif({exId}){
  const[url,setUrl]=useState(null);const[loading,setLoading]=useState(true);
  useEffect(()=>{let m=true;fetchGif(exId).then(u=>{if(m){setUrl(u);setLoading(false)}});return()=>{m=false}},[exId]);
  if(loading)return<div style={{width:'100%',height:120,background:C.s3,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:C.t3}}>Cargando GIF...</div>;
  if(!url)return<div style={{width:'100%',height:80,background:C.s3,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:C.t3}}>Sin imagen disponible</div>;
  return<img src={url} alt="" style={{width:'100%',maxHeight:180,objectFit:'contain',borderRadius:8,background:C.s3}}/>;
}

function YTButton({exId}){
  const name=EX[exId]?.[0]||'';
  const q=encodeURIComponent(name+' técnica ejercicio');
  return<a href={`https://www.youtube.com/results?search_query=${q}`} target="_blank" rel="noopener noreferrer" style={{...sty.bts,padding:'6px 10px',fontSize:12,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:4}}>▶ YouTube</a>
}

// ═══════════ HOME ═══════════
function Home({week,metrics,history,onStart,onPlan,setWeek}){
  const wk=PLAN[week-1];if(!wk)return null;
  const dow=new Date().getDay();
  const dayIdx=dow===1?0:dow===3?1:dow===5?2:null;
  const todayPlan=dayIdx!==null?wk.d[dayIdx]:null;
  const lw=metrics.length>0?metrics[0].weight:79;
  const wkDone=history.filter(h=>h.week===week).length;
  const dateStr=new Date().toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'});

  return<div style={sty.page}><div style={sty.hdr}>
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{width:32,height:32,borderRadius:'50%',background:C.acd,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:C.ach}}>JS</div>
      <div><div style={{fontSize:14,fontWeight:700}}>Jorge Silva</div><div style={{fontSize:10,color:C.t3,textTransform:'capitalize'}}>{dateStr}</div></div>
    </div>
    <div style={{display:'flex',alignItems:'center',gap:6}}>
      <button onClick={()=>setWeek(Math.max(1,week-1))} style={{...sty.bts,padding:'5px 8px',fontSize:12}}>←</button>
      <span style={{fontSize:13,fontWeight:700,color:C.ach,minWidth:60,textAlign:'center'}}>Sem {week}</span>
      <button onClick={()=>setWeek(Math.min(14,week+1))} style={{...sty.bts,padding:'5px 8px',fontSize:12}}>→</button>
    </div>
  </div>
  <div style={sty.wrap}>
    <div style={{...sty.card,marginBottom:14,background:C.acd,borderColor:'rgba(224,85,32,0.2)'}}>
      <div style={{fontSize:10,fontWeight:600,color:C.ach,textTransform:'uppercase',letterSpacing:'0.07em'}}>{wk.ph}</div>
      <div style={{fontSize:12,color:C.t2,marginTop:3}}>{wk.info}</div>
    </div>

    {todayPlan?<div style={{...sty.card,marginBottom:14,border:`1px solid ${C.ac}`}}>
      <div style={{fontSize:10,fontWeight:600,color:C.ach,textTransform:'uppercase',marginBottom:6}}>Hoy</div>
      <div style={{fontSize:18,fontWeight:800,marginBottom:3}}>{todayPlan[0]}</div>
      <div style={{fontSize:12,color:C.t2,marginBottom:12}}>{todayPlan[1].length} ejercicios</div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>onStart(week,dayIdx)} style={{...sty.btn,flex:2,padding:'10px'}}>▶ Iniciar</button>
        <button onClick={()=>onPlan(week,dayIdx)} style={{...sty.bts,flex:1}}>Ver plan</button>
      </div>
    </div>:<div style={{...sty.card,marginBottom:14,textAlign:'center',padding:20}}>
      <div style={{fontSize:24,marginBottom:6}}>🧘</div>
      <div style={{fontSize:16,fontWeight:700}}>Día de descanso</div>
      <div style={{fontSize:12,color:C.t2,marginTop:4}}>Natación, deporte o movilidad</div>
    </div>}

    <div style={{display:'flex',gap:8,marginBottom:18}}>
      <Stat l="Peso" v={`${lw} kg`}/><Stat l="Semana" v={`${wkDone}/3`} c={wkDone>=2?C.ok:undefined}/><Stat l="Total" v={history.length}/>
    </div>

    <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10}}>Sesiones Semana {week}</div>
    <div style={{display:'flex',flexDirection:'column',gap:7}}>
      {wk.d.map((d,i)=>{
        const done=history.some(h=>h.week===week&&h.dayIdx===i);
        const isToday=i===dayIdx;
        return<button key={i} onClick={()=>onPlan(week,i)} style={{...sty.card,cursor:'pointer',display:'flex',alignItems:'center',gap:10,border:isToday?`1px solid ${C.ac}`:`0.5px solid ${C.br}`,background:isToday?C.acd:C.s2,textAlign:'left',padding:'10px 12px',fontFamily:'inherit'}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:done?C.ok:isToday?C.ac:C.t3}}/>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:isToday?C.t1:C.t2}}>{d[0]}</div></div>
          <span style={pill(C.ac)}>{d[1].length} ej.</span>
          <span style={{color:C.t3,fontSize:14}}>›</span>
        </button>})}
    </div>
  </div></div>
}

// ═══════════ PLAN VIEW ═══════════
function PlanView({week,dayIdx,onBack,onStart}){
  const wk=PLAN[week-1];if(!wk)return null;
  const[d_name,exs]=wk.d[dayIdx];
  const[selEx,setSelEx]=useState(null);
  return<div style={sty.page}><div style={sty.hdr}>
    <button onClick={onBack} style={{...sty.bts,padding:'6px 12px',fontSize:12}}>← Volver</button>
    <div style={{textAlign:'right'}}><div style={{fontSize:10,color:C.t3}}>Semana {week}</div><div style={{fontSize:14,fontWeight:700}}>{d_name}</div></div>
  </div>
  <div style={sty.wrap}>
    <div style={{display:'flex',gap:8,marginBottom:16}}>
      <Stat l="Ejercicios" v={exs.length}/><Stat l="Series" v={exs.reduce((a,e)=>a+e[1],0)}/><Stat l="Fase" v={wk.ph}/>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:18}}>
      {exs.map((e,i)=>{
        const[eid,sets,reps,rest,tech]=e;
        const ex=EX[eid]||['?','?','?',''];
        const open=selEx===i;
        return<div key={i} style={sty.card}>
          <div onClick={()=>setSelEx(open?null:i)} style={{cursor:'pointer',display:'flex',gap:10,alignItems:'flex-start'}}>
            <div style={{width:22,height:22,borderRadius:6,background:C.acd,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:C.ach,flexShrink:0}}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>{ex[0]}</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                <span style={pill(C.ac)}>{ex[1]}</span>
                <span style={{fontSize:11,color:C.t3}}>{sets}×{reps} · {rest}</span>
              </div>
              {tech&&<div style={{fontSize:11,color:C.wn,marginTop:4}}>⚡ {tech}</div>}
            </div>
            <span style={{color:C.t3,fontSize:13}}>{open?'▾':'▸'}</span>
          </div>
          {open&&<div style={{marginTop:10,borderTop:`0.5px solid ${C.br}`,paddingTop:10}}>
            <ExGif exId={eid}/>
            <div style={{marginTop:8,display:'flex',gap:8,alignItems:'center'}}>
              <YTButton exId={eid}/>
              <span style={{fontSize:11,color:C.t3}}>Sec: {ex[2]}</span>
            </div>
          </div>}
        </div>})}
    </div>
    <button onClick={()=>onStart(week,dayIdx)} style={sty.btn}>▶ Iniciar entrenamiento</button>
  </div></div>
}

// ═══════════ ACTIVE WORKOUT ═══════════
function Active({week,dayIdx,exHistory,prs,onFinish}){
  const wk=PLAN[week-1];const[d_name,exs]=wk.d[dayIdx];
  const[exIdx,setExIdx]=useState(0);
  const[sets,setSets]=useState(()=>{const s={};exs.forEach((e,i)=>{s[i]=Array.from({length:e[1]},()=>({reps:'',kg:'',done:false,isPR:false}))});return s});
  const[timer,setTimer]=useState(0);const[timerMax,setTimerMax]=useState(0);const[showTimer,setShowTimer]=useState(false);
  const[startTime]=useState(Date.now());const[,tick]=useState(0);
  const tRef=useRef(null);

  useEffect(()=>{const iv=setInterval(()=>tick(t=>t+1),60000);return()=>clearInterval(iv)},[]);
  useEffect(()=>{if(!showTimer||timer<=0)return;tRef.current=setTimeout(()=>setTimer(s=>s-1),1000);return()=>clearTimeout(tRef.current)},[showTimer,timer]);

  const e=exs[exIdx];const[eid,eSets,eReps,eRest,eTech]=e;const ex=EX[eid]||['?','?','?',''];
  const exSets=sets[exIdx]||[];
  const prev=exHistory[eid]?.[0];const prevSets=prev?.sets||[];
  const totalDone=exs.filter((_,i)=>{const sd=sets[i]||[];return sd.length>0&&sd.every(s=>s.done)}).length;
  const elapsed=Math.round((Date.now()-startTime)/60000);
  const pct=Math.round((totalDone/exs.length)*100);
  const restSecs=parseInt(eRest)||60;
  const currentPR=prs[eid];

  const updateSet=(si,f,v)=>setSets(p=>({...p,[exIdx]:p[exIdx].map((s,i)=>i===si?{...s,[f]:v}:s)}));
  const markDone=(si)=>{
    const s=sets[exIdx][si];const kg=parseFloat(s.kg)||0;
    const isPR=kg>0&&(!currentPR||kg>currentPR.kg);
    setSets(p=>({...p,[exIdx]:p[exIdx].map((s,i)=>i===si?{...s,done:true,isPR}:s)}));
    setTimer(restSecs);setTimerMax(restSecs);setShowTimer(true);
  };
  const finish=()=>{
    const newExH={};const newPRs={};
    exs.forEach((e,i)=>{const[eid2]=e;const sd=sets[i]||[];const done=sd.filter(s=>s.done&&s.kg);
      if(done.length>0){newExH[eid2]={date:new Date().toISOString(),sets:done.map(s=>({reps:s.reps,kg:s.kg}))};
        const mx=Math.max(...done.map(s=>parseFloat(s.kg)||0));
        if(mx>0&&(!prs[eid2]||mx>prs[eid2].kg))newPRs[eid2]={date:new Date().toISOString(),kg:mx,reps:done.find(s=>parseFloat(s.kg)===mx)?.reps||0}}});
    onFinish({week,dayIdx,duration:elapsed,exercisesDone:totalDone,totalExercises:exs.length,newExH,newPRs,dayName:d_name});
  };

  if(showTimer&&timer>0)return<div style={{...sty.page,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',gap:14,padding:'40px 20px'}}>
    <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:'uppercase'}}>Descanso</div>
    <div style={{fontSize:80,fontWeight:800,fontVariantNumeric:'tabular-nums',lineHeight:1}}>{Math.floor(timer/60)}:{String(timer%60).padStart(2,'0')}</div>
    <div style={{width:180,height:3,background:C.s3,borderRadius:2}}><div style={{height:'100%',width:`${(timer/timerMax)*100}%`,background:C.ac,borderRadius:2,transition:'width 0.9s linear'}}/></div>
    <div style={{fontSize:12,color:C.t2}}>{ex[0]}</div>
    <div style={{display:'flex',gap:10,marginTop:8}}>
      <button onClick={()=>setTimer(s=>s+30)} style={{...sty.bts,padding:'10px 20px'}}>+30s</button>
      <button onClick={()=>setShowTimer(false)} style={{...sty.btn,width:'auto',padding:'10px 26px'}}>Listo →</button>
    </div>
  </div>;

  return<div style={sty.page}><div style={sty.hdr}>
    <div style={{minWidth:0}}><div style={{fontSize:10,color:C.t2}}>{d_name}</div><div style={{fontSize:13,fontWeight:700,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:190}}>{ex[0]}</div></div>
    <div style={{display:'flex',gap:8,alignItems:'center',flexShrink:0}}>
      <span style={{fontSize:11,color:C.t2}}>{elapsed}min</span>
      <button onClick={finish} style={{...sty.bts,padding:'5px 10px',fontSize:12}}>Terminar</button>
    </div>
  </div>
  <div style={{height:3,background:C.s3}}><div style={{height:'100%',width:`${pct}%`,background:C.ac,transition:'width 0.4s'}}/></div>
  <div style={{textAlign:'center',fontSize:10,color:C.t3,padding:'4px 0',borderBottom:`0.5px solid ${C.br}`}}>Ejercicio {exIdx+1}/{exs.length} · {totalDone} completados</div>
  <div style={sty.wrap}>
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center',marginBottom:6}}>
        <span style={pill(C.ac)}>{ex[1]}</span>
        <span style={{fontSize:11,color:C.t3}}>{eSets}s · {eReps}r · {eRest}</span>
        {currentPR&&<span style={{fontSize:10,fontWeight:700,color:C.gold,background:'rgba(255,215,0,0.1)',padding:'2px 6px',borderRadius:4}}>🏆 PR {currentPR.kg}kg</span>}
      </div>
      {prev&&<div style={{fontSize:11,color:C.t2,background:C.s3,borderRadius:6,padding:'5px 9px',marginBottom:6}}>📅 Anterior: máx {Math.max(...prev.sets.map(s=>parseFloat(s.kg)||0))}kg</div>}
      {eTech&&<div style={{fontSize:12,color:C.wn,background:'rgba(192,123,16,0.06)',borderRadius:7,padding:'6px 10px',borderLeft:`2px solid ${C.wn}`}}>⚡ {eTech}</div>}
    </div>

    <div style={{...sty.card,padding:0,overflow:'hidden',marginBottom:14}}>
      <div style={{display:'grid',gridTemplateColumns:'24px 54px 1fr 1fr 26px',padding:'6px 10px',borderBottom:`0.5px solid ${C.br}`,gap:4}}>
        {['#','Prev','Reps','Kg',''].map((h,i)=><div key={i} style={{fontSize:9,fontWeight:600,color:C.t3,textTransform:'uppercase'}}>{h}</div>)}
      </div>
      {exSets.map((s,si)=>{
        const p=prevSets[si]||prevSets[prevSets.length-1];const pt=p?.kg?`${p.kg}×${p.reps}`:'-';
        return<div key={si} style={{display:'grid',gridTemplateColumns:'24px 54px 1fr 1fr 26px',padding:'8px 10px',borderBottom:si<exSets.length-1?`0.5px solid ${C.br}`:'none',background:s.done?(s.isPR?'rgba(255,215,0,0.06)':C.okd):'transparent',alignItems:'center',gap:4}}>
          <div style={{fontSize:12,fontWeight:700,color:s.done?(s.isPR?C.gold:C.ok):C.t3}}>{si+1}{s.isPR?' 🏆':''}</div>
          <div style={{fontSize:10,color:C.t3,fontVariantNumeric:'tabular-nums'}}>{pt}</div>
          <input type="number" min="0" placeholder={eReps.replace(/\D/g,'')||'—'} value={s.reps} onChange={e=>updateSet(si,'reps',e.target.value)} disabled={s.done} style={{...sty.inp,padding:'5px 6px',textAlign:'center',opacity:s.done?0.4:1,fontSize:13}}/>
          <input type="number" min="0" step="2.5" placeholder={p?.kg||'kg'} value={s.kg} onChange={e=>updateSet(si,'kg',e.target.value)} disabled={s.done} style={{...sty.inp,padding:'5px 6px',textAlign:'center',opacity:s.done?0.4:1,fontSize:13}}/>
          <div style={{display:'flex',justifyContent:'center'}}>
            {s.done?<span style={{fontSize:14,color:s.isPR?C.gold:C.ok}}>✓</span>:<button onClick={()=>markDone(si)} style={{width:24,height:24,borderRadius:6,border:`1px solid ${C.brm}`,background:'transparent',cursor:'pointer',color:C.t3,fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'inherit'}}>○</button>}
          </div>
        </div>})}
    </div>

    <div style={{display:'flex',gap:8,marginBottom:14}}>
      <button onClick={()=>{setExIdx(i=>Math.max(0,i-1));setShowTimer(false)}} disabled={exIdx===0} style={{...sty.bts,flex:1,opacity:exIdx===0?0.25:1}}>← Anterior</button>
      {exIdx<exs.length-1?<button onClick={()=>{setExIdx(i=>i+1);setShowTimer(false)}} style={{...sty.btn,flex:2}}>Siguiente →</button>:<button onClick={finish} style={{...sty.btn,flex:2,background:C.ok}}>Finalizar ✓</button>}
    </div>
    <div style={{display:'flex',gap:4,justifyContent:'center',flexWrap:'wrap'}}>
      {exs.map((_,i)=>{const sd=sets[i]||[];const done=sd.every(s=>s.done);return<button key={i} onClick={()=>{setExIdx(i);setShowTimer(false)}} style={{width:8,height:8,borderRadius:'50%',border:'none',cursor:'pointer',padding:0,background:done?C.ok:i===exIdx?C.ac:C.s3,flexShrink:0}}/>})}
    </div>
  </div></div>
}

// ═══════════ PROGRESS ═══════════
function Progress({metrics,history,exHistory,prs,measures,saveMetrics,saveMeasures}){
  const[tab,setTab]=useState('peso');const[nw,setNw]=useState('');const[mf,setMf]=useState({});
  const lw=metrics.length>0?metrics[0].weight:79;
  const exNames={};Object.entries(EX).forEach(([id,e])=>{exNames[id]=e[0]});

  const addW=async()=>{const w=parseFloat(nw);if(!w||w<30||w>300)return;await saveMetrics([{date:new Date().toISOString(),weight:w},...metrics].slice(0,200));setNw('')};
  const addM=async()=>{await saveMeasures([{date:new Date().toISOString(),...mf},...measures].slice(0,200));setMf({})};

  const TABS=[{id:'peso',l:'Peso'},{id:'medidas',l:'Medidas'},{id:'ejercicios',l:'Ejercicios'},{id:'records',l:'PRs'}];

  return<div style={sty.page}><div style={sty.hdr}><div style={{fontSize:14,fontWeight:700}}>Progreso</div></div>
  <div style={{display:'flex',borderBottom:`0.5px solid ${C.br}`,background:C.s1}}>
    {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:'transparent',border:'none',borderBottom:tab===t.id?`2px solid ${C.ac}`:'2px solid transparent',padding:'9px 3px',fontSize:11,fontWeight:600,color:tab===t.id?C.ac:C.t3,cursor:'pointer',fontFamily:'inherit'}}>{t.l}</button>)}
  </div>
  <div style={sty.wrap}>
    {tab==='peso'&&<>
      <div style={{...sty.card,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Registrar peso</div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input type="number" step="0.1" placeholder="79.0" value={nw} onChange={e=>setNw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addW()} style={{...sty.inp,flex:1}}/>
          <span style={{fontSize:13,color:C.t2}}>kg</span>
          <button onClick={addW} style={{...sty.btn,width:'auto',padding:'8px 13px',flexShrink:0}}>Guardar</button>
        </div>
      </div>
      {metrics.length>=2&&<div style={{...sty.card,marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:'uppercase',marginBottom:6}}>Evolución</div>
        <ResponsiveContainer width="100%" height={100}><LineChart data={metrics.slice(0,15).reverse().map(m=>({v:m.weight}))}>
          <Line type="monotone" dataKey="v" stroke={C.ac} strokeWidth={2} dot={false}/><Tooltip/>
        </LineChart></ResponsiveContainer>
      </div>}
      {metrics.length>0&&<div style={{...sty.card,padding:0}}>
        {metrics.slice(0,15).map((m,i)=>{const prev=metrics[i+1];const delta=prev?m.weight-prev.weight:null;
          return<div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',borderBottom:i<Math.min(metrics.length,15)-1?`0.5px solid ${C.br}`:'none'}}>
            <span style={{fontSize:12,color:C.t2}}>{new Date(m.date).toLocaleDateString('es-CO',{day:'numeric',month:'short'})}</span>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {delta!==null&&<span style={{fontSize:11,color:delta<0?C.ok:delta>0?C.ac:C.t3}}>{delta>0?'+':''}{delta.toFixed(1)}</span>}
              <span style={{fontSize:13,fontWeight:600}}>{m.weight} kg</span>
            </div></div>})}
      </div>}
    </>}

    {tab==='medidas'&&<>
      <div style={{...sty.card,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Nueva medición</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10}}>
          {MFIELDS.map(f=><div key={f.id}><div style={{fontSize:10,color:C.t3,marginBottom:3}}>{f.l}</div><input type="number" step="0.5" placeholder="—" value={mf[f.id]||''} onChange={e=>setMf(p=>({...p,[f.id]:e.target.value}))} style={{...sty.inp,padding:'5px 7px'}}/></div>)}
        </div>
        <button onClick={addM} style={sty.btn}>Guardar mediciones</button>
      </div>
      {measures.length>0&&<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {MFIELDS.filter(f=>measures[0][f.id]).map(f=><div key={f.id} style={{background:C.s1,borderRadius:10,padding:'10px 11px',border:`0.5px solid ${C.br}`}}>
          <div style={{fontSize:15,fontWeight:700}}>{measures[0][f.id]} cm</div>
          <div style={{fontSize:10,color:C.t3,marginTop:2}}>{f.l}</div>
        </div>)}
      </div>}
    </>}

    {tab==='ejercicios'&&<>
      {Object.keys(exHistory).length===0?<div style={{textAlign:'center',padding:40,color:C.t3,fontSize:13}}>Las gráficas aparecerán después de entrenar.</div>
      :Object.entries(exHistory).map(([eid,hist])=>{
        if(!hist||hist.length===0)return null;
        const chartData=hist.slice(0,10).reverse().map(h=>({v:Math.max(...h.sets.map(s=>parseFloat(s.kg)||0))})).filter(d=>d.v>0);
        return<div key={eid} style={{...sty.card,marginBottom:8}}>
          <div style={{fontSize:12,fontWeight:600,marginBottom:chartData.length>=2?6:0}}>{exNames[eid]||eid}</div>
          <div style={{fontSize:10,color:C.t3}}>{hist.length} sesiones · mejor: {Math.max(...hist[0].sets.map(s=>parseFloat(s.kg)||0))}kg</div>
          {chartData.length>=2&&<ResponsiveContainer width="100%" height={50}><LineChart data={chartData}><Line type="monotone" dataKey="v" stroke={C.ac} strokeWidth={1.5} dot={false}/></LineChart></ResponsiveContainer>}
        </div>})}
    </>}

    {tab==='records'&&<>
      {Object.keys(prs).length===0?<div style={{textAlign:'center',padding:40,color:C.t3,fontSize:13}}>Tus récords aparecerán aquí.</div>
      :<div style={{display:'flex',flexDirection:'column',gap:6}}>
        {Object.entries(prs).map(([eid,pr])=><div key={eid} style={{...sty.card,display:'flex',alignItems:'center',gap:10}}>
          <div style={{fontSize:20}}>🏆</div>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{exNames[eid]||eid}</div><div style={{fontSize:10,color:C.t3}}>{new Date(pr.date).toLocaleDateString('es-CO',{day:'numeric',month:'short'})}</div></div>
          <div style={{textAlign:'right'}}><div style={{fontSize:18,fontWeight:800,color:C.gold}}>{pr.kg}kg</div><div style={{fontSize:10,color:C.t3}}>{pr.reps} reps</div></div>
        </div>)}
      </div>}
    </>}
  </div></div>
}

// ═══════════ NUTRITION ═══════════
function Nutrition({nutrition,saveNutrition}){
  const tk=new Date().toISOString().split('T')[0];
  const today=nutrition.find(n=>n.date===tk)||{date:tk,meals:[],cal:0,prot:0};
  const[mn,setMn]=useState('');const[mc,setMc]=useState('');const[mp,setMp]=useState('');const[mnt,setMnt]=useState('');
  const[mca,setMca]=useState('');const[mf,setMf]=useState('');

  const add=async()=>{if(!mn)return;
    const meal={name:mn,cal:parseInt(mc)||0,prot:parseInt(mp)||0,carbs:parseInt(mca)||0,fat:parseInt(mf)||0,notes:mnt};
    const upd={...today,meals:[...today.meals,meal],cal:(today.cal||0)+meal.cal,prot:(today.prot||0)+meal.prot};
    await saveNutrition([upd,...nutrition.filter(n=>n.date!==tk)].slice(0,90));
    setMn('');setMc('');setMp('');setMnt('');setMca('');setMf('');
  };

  const MacroBar=({l,cur,goal,c})=>{const p=Math.min(100,Math.round((cur/goal)*100));
    return<div style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:11,color:C.t2}}>{l}</span><span style={{fontSize:11,fontWeight:600}}>{cur}/{goal}</span></div>
    <div style={{height:4,background:C.s3,borderRadius:2}}><div style={{height:'100%',width:`${p}%`,background:c,borderRadius:2,transition:'width 0.4s'}}/></div></div>};

  return<div style={sty.page}><div style={sty.hdr}>
    <div style={{fontSize:14,fontWeight:700}}>Nutrición</div>
    <div style={{fontSize:10,color:C.t3,textTransform:'capitalize'}}>{new Date().toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'})}</div>
  </div>
  <div style={sty.wrap}>
    <div style={{...sty.card,marginBottom:14}}>
      <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Hoy</div>
      <MacroBar l="Calorías" cur={today.cal||0} goal={GOALS.cal} c={C.ach}/>
      <MacroBar l="Proteína" cur={today.prot||0} goal={GOALS.prot} c={C.pur}/>
    </div>

    <div style={{display:'flex',gap:8,marginBottom:14}}>
      <Stat l="Kcal" v={today.cal||0} c={(today.cal||0)>=GOALS.cal*0.9?C.ok:undefined}/>
      <Stat l="Prot." v={`${today.prot||0}g`} c={(today.prot||0)>=GOALS.prot*0.9?C.ok:undefined}/>
      <Stat l="Comidas" v={today.meals.length}/>
    </div>

    <div style={{...sty.card,marginBottom:14}}>
      <div style={{fontSize:12,fontWeight:600,marginBottom:10}}>Agregar comida</div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <input placeholder="Nombre (ej: Comida principal)" value={mn} onChange={e=>setMn(e.target.value)} style={sty.inp}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>Calorías</div><input type="number" placeholder="kcal" value={mc} onChange={e=>setMc(e.target.value)} style={sty.inp}/></div>
          <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>Proteína (g)</div><input type="number" placeholder="g" value={mp} onChange={e=>setMp(e.target.value)} style={sty.inp}/></div>
          <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>Carbos (g)</div><input type="number" placeholder="g" value={mca} onChange={e=>setMca(e.target.value)} style={sty.inp}/></div>
          <div><div style={{fontSize:10,color:C.t3,marginBottom:3}}>Grasas (g)</div><input type="number" placeholder="g" value={mf} onChange={e=>setMf(e.target.value)} style={sty.inp}/></div>
        </div>
        <input placeholder="Notas (ej: Pollo, arroz, aguacate)" value={mnt} onChange={e=>setMnt(e.target.value)} style={sty.inp}/>
        <button onClick={add} style={sty.btn}>+ Agregar</button>
      </div>
    </div>

    {today.meals.length>0&&<>
      <div style={{fontSize:10,fontWeight:600,color:C.t3,textTransform:'uppercase',marginBottom:8}}>Comidas de hoy</div>
      <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:14}}>
        {today.meals.map((m,i)=><div key={i} style={sty.card}>
          <div style={{display:'flex',justifyContent:'space-between'}}>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{m.name}</div>{m.notes&&<div style={{fontSize:11,color:C.t2,marginTop:2}}>{m.notes}</div>}</div>
            <div style={{textAlign:'right',flexShrink:0,marginLeft:10}}>
              <div style={{fontSize:12,fontWeight:600,color:C.ach}}>{m.cal} kcal</div>
              <div style={{fontSize:10,color:C.pur}}>{m.prot}g prot</div>
            </div></div>
        </div>)}
      </div>
    </>}

    <div style={{...sty.card,background:C.s1}}>
      <div style={{fontSize:11,fontWeight:600,marginBottom:8}}>Objetivos diarios</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
        {[{l:'Calorías',v:'~2,400 kcal',c:C.ach},{l:'Proteína',v:'~158 g',c:C.pur},{l:'Carbos',v:'~280 g',c:C.ok},{l:'Grasas',v:'~71 g',c:C.wn}].map(({l,v,c})=><div key={l} style={{background:C.s3,borderRadius:7,padding:'7px 9px'}}><div style={{fontSize:12,fontWeight:700,color:c}}>{v}</div><div style={{fontSize:10,color:C.t3,marginTop:2}}>{l}</div></div>)}
      </div>
    </div>
  </div></div>
}

// ═══════════ MAIN APP ═══════════
export default function App(){
  const[view,setView]=useState('home');
  const[week,setWeek]=useState(1);
  const[selDay,setSelDay]=useState(0);
  const[session,setSession]=useState(null);
  const[metrics,setMetrics]=useState([]);
  const[history,setHistory]=useState([]);
  const[exHistory,setExHistory]=useState({});
  const[prs,setPrs]=useState({});
  const[measures,setMeasures]=useState([]);
  const[nutrition,setNutrition]=useState([]);

  useEffect(()=>{(async()=>{
    const keys=['js3_metrics','js3_history','js3_exhist','js3_prs','js3_measures','js3_nutrition','js3_week'];
    const setters=[setMetrics,setHistory,setExHistory,setPrs,setMeasures,setNutrition,(v)=>setWeek(v||1)];
    for(let i=0;i<keys.length;i++){const r=await load(keys[i]);if(r)setters[i](r)}
  })()},[]);

  const sv=async(k,d,setter)=>{setter(d);await save(k,d)};
  const saveMetrics=d=>sv('js3_metrics',d,setMetrics);
  const saveMeasures=d=>sv('js3_measures',d,setMeasures);
  const saveNutrition=d=>sv('js3_nutrition',d,setNutrition);
  const changeWeek=(w)=>{setWeek(w);save('js3_week',w)};

  const startWorkout=(w,di)=>{setSession({week:w,dayIdx:di});setView('active')};
  const finishWorkout=async({week:w,dayIdx:di,duration,exercisesDone,totalExercises,newExH,newPRs,dayName})=>{
    const entry={date:new Date().toISOString(),week:w,dayIdx:di,name:dayName,duration,exercisesDone,totalExercises};
    const nh=[entry,...history].slice(0,300);setHistory(nh);await save('js3_history',nh);
    const ue={...exHistory};Object.entries(newExH).forEach(([id,d])=>{ue[id]=[d,...(ue[id]||[])].slice(0,20)});setExHistory(ue);await save('js3_exhist',ue);
    const up={...prs,...newPRs};setPrs(up);await save('js3_prs',up);
    setSession(null);setView('home');
  };

  if(view==='active'&&session)return<Active week={session.week} dayIdx={session.dayIdx} exHistory={exHistory} prs={prs} onFinish={finishWorkout}/>;
  if(view==='plan')return<PlanView week={week} dayIdx={selDay} onBack={()=>setView('home')} onStart={(w,d)=>startWorkout(w,d)}/>;

  return<>
    {view==='home'&&<Home week={week} metrics={metrics} history={history} onStart={startWorkout} onPlan={(w,d)=>{setSelDay(d);setView('plan')}} setWeek={changeWeek}/>}
    {view==='progress'&&<Progress metrics={metrics} history={history} exHistory={exHistory} prs={prs} measures={measures} saveMetrics={saveMetrics} saveMeasures={saveMeasures}/>}
    {view==='nutrition'&&<Nutrition nutrition={nutrition} saveNutrition={saveNutrition}/>}
    <BottomNav a={view} set={(v)=>{if(view!=='active')setView(v)}}/>
  </>;
}
