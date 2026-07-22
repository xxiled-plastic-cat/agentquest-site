# Character Creation Backlog

## Post-MVP: User-Uploaded Portraits

For MVP, keep character creation focused on the curated portrait set:

- `public/agent-portraits/male_001.png` through `male_006.png`
- `public/agent-portraits/female_001.png` through `female_006.png`

User-uploaded portraits should wait until authentication and profile persistence exist.

### Desired Upload Flow

Once auth exists:

1. User opens the character creator.
2. User chooses a preset portrait or selects an `Upload` option.
3. Frontend validates the file for basic constraints:
   - image only
   - limited file size, likely 2-5MB
   - accepted types: `image/png`, `image/jpeg`, `image/webp`
4. Backend/storage layer stores the upload under the authenticated user.
5. Image is normalized:
   - strip metadata
   - resize to bounded portrait dimensions
   - optionally convert to `webp`
6. The saved agent profile stores a portrait reference, not the binary image.

### Storage Direction

Do not save user uploads into `public/` or commit them to git.

Use object storage, likely Supabase Storage if the project continues with Supabase persistence.

Suggested bucket:

```text
agent-portraits
```

Suggested object paths:

```text
users/{userId}/portraits/{portraitId}.webp
```

or, once saved agents exist:

```text
users/{userId}/agents/{agentId}/portrait.webp
```

Prefer the first shape during creation because an upload may happen before an agent is saved or deployed.

### Portrait Reference Shape

Agent profile data should store a structured portrait reference:

```ts
type AgentPortrait =
  | {
      type: "preset";
      id: "male_001";
      url: "/agent-portraits/male_001.png";
    }
  | {
      type: "upload";
      storagePath: "users/{userId}/portraits/{portraitId}.webp";
      publicUrl?: string;
    };
```

### Access Model

Likely direction:

- Public-read portraits for published agent profile pages.
- Authenticated writes only.
- Users can only upload, replace, or delete portraits under their own storage prefix.
- Backend validates ownership before attaching an uploaded portrait to an agent.

If moderation becomes necessary, start with private uploads and expose portraits through signed URLs or a backend proxy.

### Security Notes

Server-side validation is required. Client-side checks are only UX.

Required safeguards:

- enforce max file size
- sniff/validate MIME type
- reject SVG uploads unless there is a dedicated sanitizer
- strip EXIF metadata
- re-encode to a known safe format
- resize to bounded dimensions
- optionally run image moderation before public display

### UI Direction

Eventually add three portrait modes in the creator:

- `Male`
- `Female`
- `Upload`

Before auth exists, upload can be prototyped with `URL.createObjectURL(file)` for local preview only, but it should not be presented as persistent.
