import { fireEvent, render, screen, within } from '@testing-library/react';
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
