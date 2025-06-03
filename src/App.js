import React, { useState, useEffect } from 'react';

function App() {
  // 数据和输入区
  const [tasks, setTasks] = useState(() => {
    const data = localStorage.getItem('tasks');
    return data ? JSON.parse(data) : [];
  });
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('普通');
  const [remindTime, setRemindTime] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('全部');
  const [filterPriority, setFilterPriority] = useState('全部');
  // 美化主题
  const [theme, setTheme] = useState('light');
  const themes = {
    light: {
      mainBg: "#fcfcfe",
      accent: "#4666f6",
      cardBg: "#fff",
      cardDone: "#ecedf3",
      text: "#222",
      boxShadow: "0 8px 32px #acbbfa33"
    },
    dark: {
      mainBg: "#23263a",
      accent: "#7ecbfa",
      cardBg: "#313146",
      cardDone: "#232634",
      text: "#fff",
      boxShadow: "0 8px 32px #13131a99"
    },
  };
  const current = themes[theme];

  // 统计
  const today = new Date();
  const todayStr = today.toISOString().slice(0,10);
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t=>t.done).length;
  const undoneTasks = totalTasks - doneTasks;
  const todayTasks = tasks.filter(t => t.remindTime && t.remindTime.startsWith(todayStr)).length;
  const todayDone = tasks.filter(t => t.remindTime && t.remindTime.startsWith(todayStr) && t.done).length;

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if(window.Notification && Notification.permission !== "granted"){
      Notification.requestPermission();
    }
  },[]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(ts => ts.map(task => {
        if (
          task.remindTime && !task.done && !task.notified &&
          new Date(task.remindTime).getTime() <= Date.now()
        ) {
          if (Notification.permission === "granted") {
            new Notification("任务提醒", { body: `${task.title} ${task.desc}` });
          } else {
            alert("有个任务到时间了：" + task.title);
          }
          return {...task, notified:true};
        } else {
          return task;
        }
      }));
    }, 15000);
    return () => clearInterval(timer);
  },[tasks]);

  const handleAdd = () => {
    if(!title.trim()) return;
    if(editId===null){
      setTasks([...tasks, {
        id: Date.now(),
        title, desc, priority,
        remindTime,
        done: false, notified: false
      }]);
    }else{
      setTasks(tasks.map(t=> t.id===editId ?
        {...t, title, desc, priority, remindTime, notified:false} : t
      ));
      setEditId(null);
    }
    setTitle('');setDesc('');setPriority('普通');setRemindTime('');
  };

  const onEdit = (id) => {
    const t = tasks.find(t=>t.id===id);
    if(t){
      setTitle(t.title); setDesc(t.desc); setPriority(t.priority); setRemindTime(t.remindTime||'');
      setEditId(id);
    }
  };

  const onDelete = id => setTasks(tasks.filter(t=>t.id!==id));

  const onToggleDone = id =>
    setTasks(tasks.map(t=> t.id===id ? {...t, done:!t.done} : t));

  const filteredTasks = tasks
    .filter(task =>
      (filterStatus==="全部"?true: (filterStatus==="已完成"?task.done:!task.done)) &&
      (filterPriority==="全部"?true: task.priority===filterPriority) &&
      (task.title.includes(search)|| (task.desc && task.desc.includes(search)))
    );

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-start py-5"
      style={{
        background: theme === "light"
          ? "linear-gradient(135deg, #f8fbfd 0%, #e0eafd 100%)"
          : "linear-gradient(135deg, #141529 0%, #34385a 100%)",
        color: current.text
      }}
    >
      <div style={{
        maxWidth: 540,
        width: "98%",
        borderRadius: 24,
        boxShadow: current.boxShadow,
        background: current.mainBg,
        color: current.text,
        padding: "36px 28px 32px 28px",
        marginTop:32
      }}>
        {/* 主题切换按钮 */}
        <div className="d-flex justify-content-end align-items-center mb-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙 切换夜间" : "🌞 切换日间"}
          </button>
        </div>
        <h2 className="mb-4" style={{
          color: current.accent,
          fontWeight:"bold",
          textShadow:"0 2px 10px #afd1ff66, 0 1px 0 #fff"
        }}>📝 我的待办事项</h2>
        {/* 今日统计条 */}
        <div className="mb-3 pb-2 d-flex flex-wrap gap-4" style={{fontSize:17, fontWeight:500, color:current.accent}}>
          <span>全部：{totalTasks}</span>
          <span>已完成：{doneTasks}</span>
          <span>未完成：{undoneTasks}</span>
          <span>今日任务：{todayTasks}（完成{todayDone}）</span>
        </div>

        {/* 新增/编辑表单 */}
        <div className="mb-4 p-3" style={{background:current.cardDone, borderRadius:14, boxShadow:current.boxShadow}}>
          <input className="form-control mb-2" value={title} onChange={e=>setTitle(e.target.value)} placeholder="✍️ 任务标题"/>
          <input className="form-control mb-2" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="详情"/>
          <div className="row g-2 mb-2">
            <div className="col">
              <select className="form-select" value={priority} onChange={e=>setPriority(e.target.value)}>
                <option value="高">🔥 高</option><option value="普通">🌊 普通</option><option value="低">🍃 低</option>
              </select>
            </div>
            <div className="col">
              <input className="form-control" type="datetime-local" value={remindTime} onChange={e=>setRemindTime(e.target.value)}/>
            </div>
          </div>
          <button className="btn w-100 btn-primary" style={{fontWeight:600, letterSpacing:1}} onClick={handleAdd}>
            {editId===null ? "➕ 添加任务" : "💾 保存修改"}
          </button>
          {editId!==null &&
            <button className="btn btn-link w-100 text-secondary" onClick={() => { setEditId(null); setTitle(''); setDesc(''); setPriority('普通'); setRemindTime(''); }}>取消编辑</button>}
        </div>

        {/* 筛选+搜索 */}
        <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
          <input className="form-control" style={{maxWidth:150}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔎查找"/>
          <select className="form-select" style={{maxWidth:120}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="全部">全部状态</option>
            <option value="未完成">未完成</option>
            <option value="已完成">已完成</option>
          </select>
          <select className="form-select" style={{maxWidth:120}} value={filterPriority} onChange={e=>setFilterPriority(e.target.value)}>
            <option value="全部">全部优先级</option>
            <option value="高">🔥 高</option>
            <option value="普通">🌊 普通</option>
            <option value="低">🍃 低</option>
          </select>
        </div>

        {/* 任务列表 */}
        <ul style={{listStyle:"none", paddingLeft:0}}>
          {filteredTasks.map(task=>(
            <li key={task.id}
              className="mb-3"
              style={{
                borderRadius:12,
                background: task.done ? current.cardDone : current.cardBg,
                boxShadow: current.boxShadow,
                opacity: task.done ? 0.7 : 1,
                transition:"all 0.2s"
              }}
            >
              <div className="d-flex justify-content-between align-items-center px-3 py-2">
                <div>
                  <span style={{
                    color:task.priority==="高"?"#e63946":
                          task.priority==="低"?"#468c46":
                          "#3355b5",
                    fontWeight:"bold",
                    fontSize:17
                  }}>{task.priority==="高"?"🔥": task.priority==="低"?"🍃":"🌊"} {task.title}</span>
                  {task.desc ? <span className="ms-2 text-secondary small">({task.desc})</span>:null}
                  {task.remindTime
                    ? <div className="small text-info">⏰提醒:{task.remindTime.replace('T',' ')}</div>
                    : null}
                  <div className="small">
                    状态：<span style={{color: task.done?"#46ae48":"#eb5944",fontWeight:600}}>{task.done?"已完成":"未完成"}</span>
                    {task.notified && <span className="badge bg-success ms-2">已提醒</span>}
                  </div>
                </div>
                <div>
                  <button className={"btn btn-sm me-1 "+(task.done?"btn-outline-success":"btn-success")}
                          style={{minWidth:60}} onClick={()=>onToggleDone(task.id)}>
                    {task.done?"↩️ 重做":"✅ 完成"}
                  </button>
                  <button className="btn btn-sm btn-outline-warning me-1" style={{minWidth:50}} onClick={()=>onEdit(task.id)}>
                    📝
                  </button>
                  <button className="btn btn-sm btn-outline-danger" style={{minWidth:50}} onClick={()=>{if(window.confirm("确定删除吗?"))onDelete(task.id)}}>
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
          {filteredTasks.length===0 &&
            <li className="text-center mt-4 text-secondary" style={{letterSpacing:2}}>🈳 暂无任务</li>}
        </ul>
      </div>
    </div>
  );
}
export default App;
