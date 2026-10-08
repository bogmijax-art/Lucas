import type { MouseEvent, ReactNode } from "react";

export default function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <div className="modal" onMouseDown={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
      <div className="modal-head"><h2>{title}</h2><button className="icon-btn" onClick={onClose}>×</button></div>
      {children}
    </div>
  </div>;
}
