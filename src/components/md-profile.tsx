import Image from "next/image";
import mdPortrait from "@/assets/samuel-celestine-ekunuchi.png";

export function MdProfile() {
  return (
    <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-card md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:p-10">
      <div className="flex flex-col items-center gap-4">
        <div className="aspect-square w-full max-w-[240px] overflow-hidden rounded-3xl border border-border bg-primary-soft shadow-sm">
          <Image
            src={mdPortrait}
            alt="Portrait of Samuel Celestine Ekunuchi, Managing Director / Chief Executive Officer"
            width={240}
            height={240}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-accent">
          Samuel Celestine Ekunuchi
        </p>
      </div>
      <div>
        <h3 className="text-2xl font-bold md:text-3xl">
          Samuel Celestine Ekunuchi
        </h3>
        <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-accent">
          Managing Director / Chief Executive Officer
        </p>
        <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
          <p>
            Samuel Celestine Ekunuchi is a dynamic, focused and pragmatic
            business leader with a strong commitment to enterprise development
            and human capacity building.
          </p>
          <p>
            He is a scholar, writer, business coach, pace setter, business
            enthusiast and investor. His leadership philosophy is rooted in
            simplicity, responsibility and leading from the front.
          </p>
          <p>
            He believes that investing in people is not merely a business
            strategy but a responsibility to humanity.
          </p>
          <p>
            He holds qualifications in Religious and Cultural Studies and Mass
            Communication, alongside other professional development and
            leadership training.
          </p>
          <p>
            Beyond his professional pursuits, he is a devoted family man,
            husband and father.
          </p>
        </div>
      </div>
    </div>
  );
}
