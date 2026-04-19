const {
  assertSupabaseConfig,
  getUserId,
  readJson,
  sendCors,
  sendJson,
  supabaseRequest,
} = require('./_supabase');

function cleanSession(session, userId) {
  return {
    id: String(session.id),
    user_id: userId,
    task_id: String(session.task_id || session.taskId || ''),
    task_title: String(session.task_title || session.taskTitle || '').trim(),
    minutes: Math.max(0, Number(session.minutes) || 0),
    session_date: session.session_date || session.date,
    completed_at: session.completed_at || session.completedAt || new Date().toISOString(),
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
      const rows = await supabaseRequest(
        `focus_sessions?user_id=${userFilter}&order=completed_at.desc`
      );
      sendJson(response, 200, rows || []);
      return;
    }

    if (request.method === 'PUT') {
      const body = await readJson(request);
      const sessions = Array.isArray(body.sessions)
        ? body.sessions.map((session) => cleanSession(session, userId))
        : [];

      await supabaseRequest(`focus_sessions?user_id=${userFilter}`, {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' },
      });

      if (sessions.length > 0) {
        await supabaseRequest('focus_sessions', {
          method: 'POST',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify(sessions),
        });
      }

      sendJson(response, 200, { ok: true, count: sessions.length });
      return;
    }

    sendJson(response, 405, { error: 'Method not allowed' });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
};
