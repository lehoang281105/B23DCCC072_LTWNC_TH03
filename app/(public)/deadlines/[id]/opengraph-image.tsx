import { ImageResponse } from 'next/og';
import { getDeadlineById, getSubjectBySlug } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Deadline Không Tồn Tại
        </div>
      ),
      size
    );
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);
  const subjectName = subject ? `${subject.name} (${subject.code})` : deadline.subjectSlug;

  const priorityColor =
    deadline.priority === 'high'
      ? '#ef4444'
      : deadline.priority === 'medium'
      ? '#f59e0b'
      : '#10b981';

  const priorityLabel =
    deadline.priority === 'high'
      ? 'ƯU TIÊN CAO'
      : deadline.priority === 'medium'
      ? 'ƯU TIÊN VỪA'
      : 'ƯU TIÊN THẤP';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#090d16',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          color: '#ffffff',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              D
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Class Deadline<span style={{ color: '#818cf8' }}>Hub</span>
              </span>
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>
                Cổng Quản Lý Deadline Lớp Học
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              border: `2px solid ${priorityColor}`,
              color: priorityColor,
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '1px',
            }}
          >
            {priorityLabel}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#a5b4fc',
              fontSize: '22px',
              fontWeight: 600,
            }}
          >
            Môn: {subjectName}
          </div>

          <div
            style={{
              fontSize: '52px',
              fontWeight: 900,
              lineHeight: 1.2,
              color: '#f8fafc',
              maxHeight: '180px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {deadline.title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #1e293b',
            paddingTop: '32px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
              Hạn chót nộp bài
            </span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#f59e0b' }}>
              {formatDate(deadline.dueDate)}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '18px',
              color: '#818cf8',
              fontWeight: 600,
            }}
          >
            class-deadline-hub.edu.vn
          </div>
        </div>
      </div>
    ),
    size
  );
}

