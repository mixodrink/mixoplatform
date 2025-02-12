import React from 'react';

interface OptionItemComponentProps {
  title: string;
  image: { src: string; alt: string };
  selected: boolean;
}

const OptionItemComponent: React.FC<OptionItemComponentProps> = ({
  title,
  image,
  selected,
}: Props) => {
  return (
    <section
      onClick={() => (selected ? console.log('error-' + title) : () => {})}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '270px',
          height: '270px',
          backgroundColor: '#fff',
          borderRadius: '3rem',
          position: 'absolute',
          bottom: 0,
        }}
      ></div>
      <img src={image.src} width={100} height={330} style={{ zIndex: 1 }} />
      <h2
        style={{
          fontSize: '2rem',
          fontWeight: 400,
          margin: 0,
          color: '#000',
          zIndex: 1,
          marginBottom: 20,
        }}
      >
        {title}
      </h2>
    </section>
  );
};

export default OptionItemComponent;
