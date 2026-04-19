import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('renders bilingual planner UI and switches to English', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', {
      name: /把任务变成你现在就能开始的下一步/i,
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', {
      name: /toggle language/i,
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /低阻力添加/i })
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /toggle language/i }));

  expect(
    screen.getByRole('heading', {
      name: /turn every task into the next step you can start now/i,
    })
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add with low friction/i })).toBeInTheDocument();
});

test('opens focus mode after clicking start now', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/任务标题/i), {
    target: { value: '写完引言' },
  });
  fireEvent.change(screen.getByLabelText(/最小下一步/i), {
    target: { value: '打开文档并先写三句' },
  });
  fireEvent.click(screen.getByRole('button', { name: /低阻力添加/i }));
  fireEvent.click(screen.getAllByRole('button', { name: /现在开始/i })[0]);

  const dialog = screen.getByRole('dialog');

  expect(dialog).toBeInTheDocument();
  expect(within(dialog).getByRole('heading', { name: /现在只做这一件事/i })).toBeInTheDocument();
  expect(within(dialog).getByText(/05:00|04:59/)).toBeInTheDocument();
  expect(within(dialog).getByText(/打开文档并先写三句/i)).toBeInTheDocument();
});

test('suggests next step and applies task templates', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/任务标题/i), {
    target: { value: '写 research paper' },
  });

  expect(screen.getByLabelText(/最小下一步/i).value).toMatch(/打开文档，先写出 3 个小标题。/i);

  fireEvent.click(screen.getByRole('button', { name: /做展示/i }));

  expect(screen.getByLabelText(/任务标题/i).value).toMatch(/准备课堂展示/i);
  expect(screen.getByLabelText(/课程 \/ 项目/i).value).toMatch(/课堂展示/i);
  expect(screen.getByLabelText(/最小下一步/i).value).toMatch(/先创建 PPT 文件，写出 3 页大纲。/i);
});

test('pressing enter in the title field does not create a task before reviewing next step', async () => {
  render(<App />);

  const titleInput = screen.getByLabelText(/任务标题/i);
  const nextStepInput = screen.getByLabelText(/最小下一步/i);

  fireEvent.change(titleInput, {
    target: { value: '我吃饭' },
  });
  fireEvent.keyDown(titleInput, { key: 'Enter', code: 'Enter' });

  await waitFor(() => expect(nextStepInput).toHaveFocus());
  expect(nextStepInput.value).toMatch(/准备食物|外卖页面/i);
  expect(screen.queryByRole('heading', { name: /我吃饭/i })).not.toBeInTheDocument();
});
