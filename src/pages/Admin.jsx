import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { Plus, Pencil, Trash2, X, Lock, Upload, GripVertical, Save, Loader2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ENTITIES = [
  { name: 'PoetryCategory', label: 'Категории стихов' },
  { name: 'Poem', label: 'Стихи' },
  { name: 'MusicAlbum', label: 'Альбомы' },
  { name: 'MusicTrack', label: 'Композиции' },
  { name: 'NewsArticle', label: 'Новости' },
  { name: 'MediaPublication', label: 'СМИ' },
  { name: 'BiographySection', label: 'Биография' },
];

const SKIP = ['id', 'created_date', 'updated_date', 'created_by_id'];
const AUDIO_FIELDS = ['audioReading', 'audioFile'];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [active, setActive] = useState('Poem');
  const [items, setItems] = useState([]);
  const [schema, setSchema] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [orderSaving, setOrderSaving] = useState(false);
  const [orderChanged, setOrderChanged] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem('schwarz_admin') === '1') setAuthed(true);
  }, []);

  const login = (e) => { e.preventDefault(); if (pass) { sessionStorage.setItem('schwarz_admin', '1'); setAuthed(true); } };

  const load = async () => {
    setLoading(true);
    setReorderMode(false);
    setOrderChanged(false);
    try {
      const sc = await base44.entities[active].schema();
      setSchema(sc);
      const sortField = sc?.properties?.sortOrder ? 'sortOrder' : '-updated_date';
      const data = await base44.entities[active].list(sortField, 200);
      setItems(data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { if (authed) load(); /* eslint-disable-next-line */ }, [authed, active]);

  const startCreate = () => setEditing({});
  const startEdit = (item) => setEditing({ ...item });

  const hasOrder = !!schema?.properties?.sortOrder;

  const save = async () => {
    setSaving(true);
    try {
      const data = { ...editing };
      Object.keys(data).forEach(k => {
        if (schema?.properties?.[k]?.type === 'array') {
          if (typeof data[k] === 'string') data[k] = data[k].split('\n').map(s => s.trim()).filter(Boolean);
        }
        if (schema?.properties?.[k]?.type === 'number' && data[k] !== '' && data[k] != null) data[k] = Number(data[k]);
        if (schema?.properties?.[k]?.type === 'boolean') data[k] = !!data[k];
      });
      if (editing.id) await base44.entities[active].update(editing.id, data);
      else await base44.entities[active].create(data);
      setEditing(null);
      load();
    } catch (e) { alert('Ошибка сохранения: ' + (e.message || e)); } finally { setSaving(false); }
  };

  const remove = async (item) => {
    if (!confirm('Удалить запись?')) return;
    await base44.entities[active].delete(item.id);
    load();
  };

  const uploadAudio = async (key, file) => {
    if (!file) return;
    setUploadingField(key);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setEditing(prev => ({ ...prev, [key]: file_url }));
    } catch (e) { alert('Ошибка загрузки файла: ' + (e.message || e)); } finally { setUploadingField(null); }
  };

  const onDragEnd = (res) => {
    if (!res.destination) return;
    const next = Array.from(items);
    const [moved] = next.splice(res.source.index, 1);
    next.splice(res.destination.index, 0, moved);
    setItems(next);
    setOrderChanged(true);
  };

  const saveOrder = async () => {
    setOrderSaving(true);
    try {
      const updates = items.map((it, i) => ({ id: it.id, sortOrder: i }));
      await base44.entities[active].bulkUpdate(updates);
      setOrderChanged(false);
      load();
    } catch (e) { alert('Ошибка сохранения порядка: ' + (e.message || e)); } finally { setOrderSaving(false); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <SEO title="CMS — ШВАРЦ ЧÖРНЫЙ" />
        <form onSubmit={login} className="text-center">
          <Lock size={28} className="mx-auto text-[#C5A059]" />
          <h1 className="font-serif-display text-3xl text-[#FDFCF8] mt-6">Закрытая панель</h1>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Пароль"
            className="mt-6 block w-72 bg-transparent border-b border-[#FDFCF8]/30 text-[#FDFCF8] px-2 py-2 focus:outline-none focus:border-[#FDFCF8]" />
          <button className="mt-6 font-ui text-[11px] uppercase tracking-[0.2em] text-[#C5A059] border border-[#C5A059] px-8 py-3 hover:bg-[#C5A059] hover:text-[#080808] transition-colors">Войти</button>
          <p className="font-ui text-[10px] text-[#A9A9A9] mt-6">Демонстрационная защита. Любой пароль откроет панель.</p>
        </form>
      </div>
    );
  }

  const fields = schema?.properties ? Object.entries(schema.properties).filter(([k]) => !SKIP.includes(k)) : [];

  return (
    <div className="pt-24 min-h-screen bg-[#F4F1E8]">
      <SEO title="CMS — ШВАРЦ ЧÖРНЫЙ" />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif-display text-4xl">Управление контентом</h1>
          <a href="/" className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808]">← На сайт</a>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {ENTITIES.map(e => (
            <button key={e.name} onClick={() => setActive(e.name)}
              className={`px-4 py-2 font-ui text-[11px] uppercase tracking-[0.15em] border transition-colors
                ${active === e.name ? 'bg-[#080808] text-[#FDFCF8] border-[#080808]' : 'border-[rgba(8,8,8,0.15)] text-[#6B6B6B] hover:border-[#080808]'}`}>
              {e.label}
            </button>
          ))}
        </div>

        {!editing ? (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button onClick={startCreate} className="inline-flex items-center gap-2 bg-[#080808] text-[#FDFCF8] px-5 py-3 font-ui text-[11px] uppercase tracking-[0.2em] hover:bg-[#8B0000] transition-colors">
                <Plus size={15} strokeWidth={1.5} /> Создать
              </button>
              {hasOrder && (
                <>
                  <button onClick={() => setReorderMode(v => !v)}
                    className={`inline-flex items-center gap-2 px-5 py-3 font-ui text-[11px] uppercase tracking-[0.2em] border transition-colors
                      ${reorderMode ? 'bg-[#8B0000] text-[#FDFCF8] border-[#8B0000]' : 'border-[rgba(8,8,8,0.15)] text-[#6B6B6B] hover:border-[#080808]'}`}>
                    <GripVertical size={15} strokeWidth={1.5} /> {reorderMode ? 'Выйти из сортировки' : 'Изменить порядок'}
                  </button>
                  {reorderMode && orderChanged && (
                    <button onClick={saveOrder} disabled={orderSaving}
                      className="inline-flex items-center gap-2 bg-[#C5A059] text-[#080808] px-5 py-3 font-ui text-[11px] uppercase tracking-[0.2em] hover:bg-[#080808] hover:text-[#FDFCF8] transition-colors disabled:opacity-50">
                      {orderSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} strokeWidth={1.5} />} Сохранить порядок
                    </button>
                  )}
                </>
              )}
            </div>

            {loading ? <div className="h-32 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div> :
              reorderMode && hasOrder ? (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="order">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="border border-[rgba(8,8,8,0.1)]">
                        {items.map((it, i) => (
                          <Draggable key={it.id} draggableId={it.id} index={i}>
                            {(p) => (
                              <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
                                className="flex items-center gap-4 px-4 py-3 border-b border-[rgba(8,8,8,0.08)] bg-[#FDFCF8] hover:bg-[#F4F1E8]">
                                <GripVertical size={16} className="text-[#A9A9A9] flex-shrink-0" />
                                <span className="font-ui text-[11px] text-[#A9A9A9] w-6 tabular-nums">{i + 1}</span>
                                <p className="font-serif-display text-lg truncate flex-1">{it.title || it.name || it.publication || it.id}</p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="border border-[rgba(8,8,8,0.1)]">
                  {items.map(it => (
                    <div key={it.id} className="flex items-center justify-between gap-4 px-4 py-3 border-b border-[rgba(8,8,8,0.08)] hover:bg-[#FDFCF8]">
                      <div className="min-w-0">
                        <p className="font-serif-display text-lg truncate">{it.title || it.name || it.publication || it.id}</p>
                        <p className="font-ui text-[10px] text-[#A9A9A9]">{it.slug || it.id}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => startEdit(it)} className="p-2 hover:bg-[#080808] hover:text-[#FDFCF8] transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => remove(it)} className="p-2 hover:bg-[#8B0000] hover:text-[#FDFCF8] transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                  {!items.length && <p className="font-serif-display italic text-[#A9A9A9] p-6">Записей нет.</p>}
                </div>
              )}
          </div>
        ) : (
          <div className="bg-[#FDFCF8] border border-[rgba(8,8,8,0.1)] p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif-display text-2xl">{editing.id ? 'Редактировать' : 'Создать'}</h2>
              <button onClick={() => setEditing(null)} className="text-[#6B6B6B] hover:text-[#080808]"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map(([key, def]) => {
                const val = editing[key] ?? (def.type === 'array' ? '' : def.type === 'boolean' ? false : '');
                const isLong = def.type === 'string' && (key === 'text' || key === 'body' || key === 'longDescription' || key === 'content' || key === 'lyrics' || key === 'credits' || key === 'description');
                const isAudio = AUDIO_FIELDS.includes(key);
                return (
                  <div key={key} className={(isLong || def.type === 'array' || isAudio) ? 'md:col-span-2' : ''}>
                    <label className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] block mb-1">{key}</label>
                    {def.type === 'boolean' ? (
                      <input type="checkbox" checked={!!val} onChange={(e) => setEditing({ ...editing, [key]: e.target.checked })} className="h-5 w-5" />
                    ) : def.type === 'number' ? (
                      <input type="number" value={val} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} className="w-full border border-[rgba(8,8,8,0.15)] px-3 py-2 focus:outline-none focus:border-[#080808]" />
                    ) : def.type === 'array' ? (
                      <textarea value={Array.isArray(val) ? val.join('\n') : val} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} rows={3} placeholder="Одно значение на строку" className="w-full border border-[rgba(8,8,8,0.15)] px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#080808]" />
                    ) : isLong ? (
                      <textarea value={val} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} rows={10} className="w-full border border-[rgba(8,8,8,0.15)] px-3 py-2 font-serif-display text-base focus:outline-none focus:border-[#080808]" />
                    ) : (
                      <input type="text" value={val} onChange={(e) => setEditing({ ...editing, [key]: e.target.value })} className="w-full border border-[rgba(8,8,8,0.15)] px-3 py-2 focus:outline-none focus:border-[#080808]" />
                    )}
                    {isAudio && (
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2 bg-[#080808] text-[#FDFCF8] px-4 py-2 font-ui text-[10px] uppercase tracking-[0.2em] hover:bg-[#8B0000] transition-colors cursor-pointer">
                          {uploadingField === key ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                          {uploadingField === key ? 'Загрузка…' : 'Загрузить аудио'}
                          <input type="file" accept="audio/*" className="hidden"
                            onChange={(e) => uploadAudio(key, e.target.files?.[0])} />
                        </label>
                        {val && <span className="font-ui text-[10px] text-[#A9A9A9] truncate max-w-xs">✓ Файл прикреплён</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={saving} className="bg-[#080808] text-[#FDFCF8] px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] hover:bg-[#8B0000] transition-colors disabled:opacity-50">
                {saving ? 'Сохраняю…' : 'Сохранить'}
              </button>
              <button onClick={() => setEditing(null)} className="px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808]">Отмена</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}