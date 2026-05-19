// Editorial portrait illustrations for the FKB Campus team page.
// Style: clean line-art, flat color, fits the editorial design language.

const SKIN = "#E8C5A0";
const SKIN_D = "#CDA87A";
const HAIR_BROWN = "#3D2510";
const HAIR_DARK = "#1E1E1E";
const HAIR_SILVER = "#B8B8B0";
const HAIR_SALT = "#706050";

export function PortraitRoland({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Roland">
      <defs>
        <clipPath id="pr-roland"><circle cx="100" cy="100" r="99" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="100" fill="#C9AD68" />
      <g clipPath="url(#pr-roland)">
        {/* Shirt */}
        <path d="M10 205 C35 172 65 160 100 158 C135 160 165 172 190 205Z" fill="#4A7BC4" />
        {/* Collar */}
        <path d="M88 157 L95 173 L100 160 L105 173 L112 157 C106 153 94 153 88 157Z" fill="white" />
        {/* Neck */}
        <rect x="89" y="143" width="22" height="18" rx="2" fill={SKIN} />
        {/* Head */}
        <ellipse cx="100" cy="103" rx="48" ry="54" fill={SKIN} />
        {/* Ears */}
        <ellipse cx="53" cy="107" rx="7" ry="9" fill={SKIN_D} />
        <ellipse cx="147" cy="107" rx="7" ry="9" fill={SKIN_D} />
        {/* Hair – dark brown, short, neat */}
        <path d="M54 87 C56 52 78 40 100 40 C122 40 144 52 146 87 C135 70 120 63 100 63 C80 63 65 70 54 87Z" fill={HAIR_BROWN} />
        <path d="M54 87 C51 95 51 103 52 108 C54 99 57 89 60 84Z" fill={HAIR_BROWN} />
        <path d="M146 87 C149 95 149 103 148 108 C146 99 143 89 140 84Z" fill={HAIR_BROWN} />
        {/* Eyebrows */}
        <path d="M73 95 Q82 91 90 93" stroke={HAIR_BROWN} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M110 93 Q119 91 127 95" stroke={HAIR_BROWN} strokeWidth="2.5" strokeLinecap="round" />
        {/* Eyes */}
        <ellipse cx="81" cy="105" rx="9" ry="8" fill="white" />
        <circle cx="81" cy="106" r="5" fill="#2C1A0E" />
        <circle cx="83" cy="104" r="1.5" fill="white" />
        <ellipse cx="119" cy="105" rx="9" ry="8" fill="white" />
        <circle cx="119" cy="106" r="5" fill="#2C1A0E" />
        <circle cx="121" cy="104" r="1.5" fill="white" />
        {/* Nose */}
        <path d="M99 118 C97 124 96 129 99 131 Q100 132 101 131 C104 129 103 124 101 118Z" fill={SKIN_D} />
        {/* Smile */}
        <path d="M87 139 Q100 149 113 139" stroke="#A0695A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M90 139 Q100 147 110 139 Q100 150 90 139Z" fill="#C07060" opacity="0.45" />
      </g>
    </svg>
  );
}

export function PortraitDrSchreiber({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dr. Schreiber">
      <defs>
        <clipPath id="pr-schreiber"><circle cx="100" cy="100" r="99" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="100" fill="#1F2B56" />
      <g clipPath="url(#pr-schreiber)">
        {/* Jacket */}
        <path d="M10 205 C30 168 64 157 100 154 C136 157 170 168 190 205Z" fill="#18182E" />
        {/* Shirt */}
        <path d="M88 154 L82 172 L100 164 L118 172 L112 154 C106 150 94 150 88 154Z" fill="#F0F0EE" />
        {/* Tie */}
        <path d="M97 154 L92 175 L100 183 L108 175 L103 154Z" fill="#7A1A2E" />
        <path d="M96 154 L97 159 L100 155 L103 159 L104 154Z" fill="#5A0A1E" />
        {/* Neck */}
        <rect x="89" y="142" width="22" height="15" rx="2" fill={SKIN} />
        {/* Head – slightly longer, academic */}
        <ellipse cx="100" cy="101" rx="47" ry="56" fill={SKIN} />
        {/* Ears */}
        <ellipse cx="54" cy="105" rx="7" ry="9" fill={SKIN_D} />
        <ellipse cx="146" cy="105" rx="7" ry="9" fill={SKIN_D} />
        {/* Hair – dark, slightly receding at temples */}
        <path d="M59 85 C62 50 80 40 100 40 C120 40 138 50 141 85 C131 67 118 61 100 61 C82 61 69 67 59 85Z" fill={HAIR_DARK} />
        <path d="M59 85 C56 94 55 103 55 108 C58 98 61 88 65 83Z" fill={HAIR_DARK} />
        <path d="M141 85 C144 94 145 103 145 108 C142 98 139 88 135 83Z" fill={HAIR_DARK} />
        {/* Receding temple highlight */}
        <ellipse cx="65" cy="78" rx="10" ry="6" fill={SKIN} opacity="0.5" />
        <ellipse cx="135" cy="78" rx="10" ry="6" fill={SKIN} opacity="0.5" />
        {/* Eyebrows – prominent, intellectual */}
        <path d="M72 95 Q81 90 92 93" stroke={HAIR_DARK} strokeWidth="3" strokeLinecap="round" />
        <path d="M108 93 Q119 90 128 95" stroke={HAIR_DARK} strokeWidth="3" strokeLinecap="round" />
        {/* Eyes */}
        <ellipse cx="81" cy="105" rx="8" ry="7" fill="white" />
        <circle cx="81" cy="106" r="4.5" fill="#1A2A3A" />
        <circle cx="82.5" cy="104" r="1.5" fill="white" />
        <ellipse cx="119" cy="105" rx="8" ry="7" fill="white" />
        <circle cx="119" cy="106" r="4.5" fill="#1A2A3A" />
        <circle cx="120.5" cy="104" r="1.5" fill="white" />
        {/* Glasses */}
        <rect x="67" y="98" width="22" height="15" rx="2" stroke="#666" strokeWidth="1.5" fill="rgba(200,220,255,0.1)" />
        <rect x="93" y="98" width="22" height="15" rx="2" stroke="#666" strokeWidth="1.5" fill="rgba(200,220,255,0.1)" />
        <line x1="89" y1="105" x2="93" y2="105" stroke="#666" strokeWidth="1.5" />
        <line x1="67" y1="105" x2="59" y2="108" stroke="#666" strokeWidth="1.5" />
        <line x1="115" y1="105" x2="123" y2="108" stroke="#666" strokeWidth="1.5" />
        {/* Nose */}
        <path d="M99 118 C97 125 96 130 99 132 Q100 133 101 132 C104 130 103 125 101 118Z" fill={SKIN_D} />
        {/* Mouth – neutral, focused */}
        <path d="M89 140 Q100 145 111 140" stroke="#906050" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function PortraitProfBrandt({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Prof. Dr. Brandt">
      <defs>
        <clipPath id="pr-brandt"><circle cx="100" cy="100" r="99" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="100" fill="#191D2E" />
      <g clipPath="url(#pr-brandt)">
        {/* Dark jacket */}
        <path d="M10 205 C32 168 64 156 100 153 C136 156 168 168 190 205Z" fill="#1A1A2E" />
        <path d="M88 153 L84 170 L100 162 L116 170 L112 153 C106 149 94 149 88 153Z" fill="#EFEFED" />
        {/* Tie – muted blue */}
        <path d="M97 153 L92 174 L100 182 L108 174 L103 153Z" fill="#3A5A8A" />
        <path d="M96 153 L97 158 L100 154 L103 158 L104 153Z" fill="#2A4A7A" />
        {/* Neck – slightly more mature skin */}
        <rect x="89" y="141" width="22" height="15" rx="2" fill="#D4A882" />
        {/* Head */}
        <ellipse cx="100" cy="101" rx="50" ry="54" fill="#D4A882" />
        {/* Ears */}
        <ellipse cx="51" cy="104" rx="8" ry="10" fill="#C4987A" />
        <ellipse cx="149" cy="104" rx="8" ry="10" fill="#C4987A" />
        {/* Silver hair */}
        <path d="M52 86 C55 50 78 38 100 38 C122 38 145 50 148 86 C135 68 120 60 100 60 C80 60 65 68 52 86Z" fill={HAIR_SILVER} />
        <path d="M52 86 C49 95 49 103 50 108 C53 98 56 88 59 83Z" fill={HAIR_SILVER} />
        <path d="M148 86 C151 95 151 103 150 108 C147 98 144 88 141 83Z" fill={HAIR_SILVER} />
        {/* Lighter streak at top */}
        <path d="M80 52 Q100 43 120 52 Q100 48 80 52Z" fill="white" opacity="0.3" />
        {/* Eyebrows – thick, gray */}
        <path d="M71 94 Q80 89 91 92" stroke="#7A7A70" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M109 92 Q120 89 129 94" stroke="#7A7A70" strokeWidth="3.5" strokeLinecap="round" />
        {/* Eyes – experienced */}
        <ellipse cx="81" cy="104" rx="9" ry="8" fill="white" />
        <circle cx="81" cy="105" r="5" fill="#2A2A2A" />
        <circle cx="83" cy="103" r="1.5" fill="white" />
        <ellipse cx="119" cy="104" rx="9" ry="8" fill="white" />
        <circle cx="119" cy="105" r="5" fill="#2A2A2A" />
        <circle cx="121" cy="103" r="1.5" fill="white" />
        {/* Subtle age lines */}
        <path d="M68 101 C65 97 64 93 66 91" stroke="#C4987A" strokeWidth="1" fill="none" opacity="0.55" />
        <path d="M132 101 C135 97 136 93 134 91" stroke="#C4987A" strokeWidth="1" fill="none" opacity="0.55" />
        {/* Nose – more prominent */}
        <path d="M99 116 C96 123 95 130 98 133 Q100 135 102 133 C105 130 104 123 101 116Z" fill="#C4987A" />
        <path d="M95 133 Q100 136 105 133" stroke="#B4876A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Subtle beard shadow */}
        <ellipse cx="100" cy="138" rx="25" ry="11" fill="#A89888" opacity="0.2" />
        {/* Mouth – authoritative, composed */}
        <path d="M88 138 Q100 144 112 138" stroke="#886050" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function PortraitArmin({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Armin">
      <defs>
        <clipPath id="pr-armin"><circle cx="100" cy="100" r="99" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="100" fill="#5C6B3A" />
      <g clipPath="url(#pr-armin)">
        {/* Suit jacket */}
        <path d="M10 205 C32 170 64 158 100 155 C136 158 168 170 190 205Z" fill="#2A2A3A" />
        {/* Shirt */}
        <path d="M89 155 L83 173 L100 164 L117 173 L111 155 C105 151 95 151 89 155Z" fill="white" />
        {/* Classic banker tie – deep red */}
        <path d="M97 155 L92 176 L100 185 L108 176 L103 155Z" fill="#5A1515" />
        <path d="M96 155 L97 160 L100 156 L103 160 L104 155Z" fill="#3A0808" />
        {/* Neck */}
        <rect x="89" y="142" width="22" height="16" rx="2" fill={SKIN} />
        {/* Head */}
        <ellipse cx="100" cy="102" rx="48" ry="53" fill={SKIN} />
        {/* Ears */}
        <ellipse cx="53" cy="105" rx="7" ry="10" fill={SKIN_D} />
        <ellipse cx="147" cy="105" rx="7" ry="10" fill={SKIN_D} />
        {/* Salt-and-pepper hair */}
        <path d="M55 88 C57 52 78 40 100 40 C122 40 143 52 145 88 C133 70 118 63 100 63 C82 63 67 70 55 88Z" fill={HAIR_SALT} />
        {/* Gray streaks */}
        <path d="M72 58 Q86 48 100 46 Q84 51 72 58Z" fill={HAIR_SILVER} opacity="0.55" />
        <path d="M128 58 Q114 48 100 46 Q116 51 128 58Z" fill={HAIR_SILVER} opacity="0.55" />
        <path d="M55 88 C52 97 52 105 53 110 C55 100 58 90 62 85Z" fill={HAIR_SALT} />
        <path d="M145 88 C148 97 148 105 147 110 C145 100 142 90 138 85Z" fill={HAIR_SALT} />
        {/* Eyebrows – salt-and-pepper */}
        <path d="M72 96 Q81 92 91 94" stroke="#605040" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M109 94 Q119 92 128 96" stroke="#605040" strokeWidth="2.5" strokeLinecap="round" />
        {/* Eyes – steady, experienced */}
        <ellipse cx="81" cy="106" rx="9" ry="7.5" fill="white" />
        <circle cx="81" cy="107" r="5" fill="#2C2010" />
        <circle cx="83" cy="105" r="1.5" fill="white" />
        <ellipse cx="119" cy="106" rx="9" ry="7.5" fill="white" />
        <circle cx="119" cy="107" r="5" fill="#2C2010" />
        <circle cx="121" cy="105" r="1.5" fill="white" />
        {/* Subtle crow's feet */}
        <path d="M69 103 C66 101 64 98 65 96" stroke={SKIN_D} strokeWidth="1" fill="none" opacity="0.45" />
        <path d="M131 103 C134 101 136 98 135 96" stroke={SKIN_D} strokeWidth="1" fill="none" opacity="0.45" />
        {/* Nose */}
        <path d="M99 118 C97 124 96 130 99 132 Q100 133 101 132 C104 130 103 124 101 118Z" fill={SKIN_D} />
        {/* Mouth – pragmatic, composed */}
        <path d="M88 139 Q100 145 112 139" stroke="#906050" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function PortraitPraktikant({ size = 200 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Praktikant 1">
      <defs>
        <clipPath id="pr-praktikant"><circle cx="100" cy="100" r="99" /></clipPath>
      </defs>
      <circle cx="100" cy="100" r="100" fill="#8A97B0" />
      <g clipPath="url(#pr-praktikant)">
        {/* Casual-business shirt */}
        <path d="M10 205 C35 175 65 162 100 160 C135 162 165 175 190 205Z" fill="#3B5A8A" />
        {/* Collar */}
        <path d="M89 160 L95 176 L100 162 L105 176 L111 160 C105 156 95 156 89 160Z" fill="white" />
        {/* Neck */}
        <rect x="89" y="145" width="22" height="18" rx="2" fill={SKIN} />
        {/* Head – rounder, younger */}
        <ellipse cx="100" cy="104" rx="46" ry="50" fill={SKIN} />
        {/* Ears */}
        <ellipse cx="55" cy="107" rx="7" ry="9" fill={SKIN_D} />
        <ellipse cx="145" cy="107" rx="7" ry="9" fill={SKIN_D} />
        {/* Hair – medium brown, slight volume, modern cut */}
        <path d="M57 92 C59 55 78 43 100 42 C122 43 141 55 143 92 C138 72 124 63 100 63 C76 63 62 72 57 92Z" fill="#5A3A22" />
        {/* Volume/top */}
        <path d="M68 65 Q84 48 100 45 Q116 48 132 65 Q115 55 100 54 Q85 55 68 65Z" fill="#6A4A32" />
        <path d="M57 92 C54 100 54 107 55 112 C57 102 60 92 64 87Z" fill="#5A3A22" />
        <path d="M143 92 C146 100 146 107 145 112 C143 102 140 92 136 87Z" fill="#5A3A22" />
        {/* Eyebrows – clean, youthful */}
        <path d="M74 97 Q82 93 90 95" stroke="#5A3A22" strokeWidth="2" strokeLinecap="round" />
        <path d="M110 95 Q118 93 126 97" stroke="#5A3A22" strokeWidth="2" strokeLinecap="round" />
        {/* Eyes – open, alert */}
        <ellipse cx="82" cy="107" rx="9" ry="8.5" fill="white" />
        <circle cx="82" cy="108" r="5.5" fill="#3A2510" />
        <circle cx="84" cy="106" r="1.8" fill="white" />
        <ellipse cx="118" cy="107" rx="9" ry="8.5" fill="white" />
        <circle cx="118" cy="108" r="5.5" fill="#3A2510" />
        <circle cx="120" cy="106" r="1.8" fill="white" />
        {/* Nose – softer */}
        <path d="M99 119 C97 124 96 128 99 130 Q100 131 101 130 C104 128 103 124 101 119Z" fill={SKIN_D} />
        {/* Mouth – eager smile */}
        <path d="M87 139 Q100 150 113 139" stroke="#A0695A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M90 139 Q100 148 110 139 Q100 151 90 139Z" fill="#C07060" opacity="0.4" />
      </g>
    </svg>
  );
}
