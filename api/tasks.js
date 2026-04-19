const {
  assertSupabaseConfig,
  getUserId,
  readJson,
  sendCors,
  sendJson,
  supabaseRequest,
} = require('./_supabase');

function cleanTask(task, userId) {
  return {
    id: String(task.id),
    user_id: userId,
    title: String(task.title || '').trim(),
    course: String(task.course || '').trim(),
    next_step: String(task.next_step || task.nextStep || '').trim(),
    effort: ['quick', 'focus', 'deep'].includes(task.effort) ? task.effort : 'quick',
    due_date: task.due_date || task.dueDate || null,
    status: ['todo', 'in_progress', 'done'].includes(task.status) ? task.status : 'todo',
    today_focus: Boolean(task.today_focus ?? task.todayFocus),
    notified: Boolean(task.notified),
    created_at: task.created_at || task.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

module.exports = async function handler(request, response) {
  sendCors(response);

  if (request.method === 'OPTIONS') {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (!assertSupabaseConfig(response)) {
    return;
  }

  const userId = getUserId(request);
  const userFilter = encodeURIComponent(`eq.${userId}`);

  try {
    if (request.method === 'GET') {
      const rows = await supabaseRequest(`tasks?user_id=${userFilter}&order=created_at.desc`);
      sendJson(response, 200, rows || []);
      return;
    }

    if (request.method === 'PUT') {
      const body = await readJson(request);
      const tasks = Array.isArray(body.tasks) ? body.tasks.map((task) => cleanTask(task, userId)) : [];

      await supabaseRequest(`tasks?user_id=${userFilter}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' },
      });

      if (tasks.length > 0) {
        await supabaseRequest('tasks', {
          method: 'POST',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify(tasks),
        });
      }

      sendJson(response, 200, { ok: true, count: tasks.length });
      return;
    }

    sendJson(response, 405, { error: 'Method not allowed' });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
};
