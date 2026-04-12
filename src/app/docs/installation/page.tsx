import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import {
  DocsPage,
  DocsSection,
  DocsH3,
  DocsParagraph,
  DocsCode,
  DocsTable,
  DocsList,
  DocsCallout,
  DocsDivider,
} from "@/components/docs-page";

export const metadata: Metadata = generatePageMetadata({
  title: "Installation | Creor",
  description:
    "Download and install Creor on macOS, Windows, or Linux. System requirements, setup steps, and first launch guide.",
  path: "/docs/installation",
});

export default function InstallationPage() {
  return (
    <DocsPage
      breadcrumb="Get Started"
      title="Installation"
      description="Download Creor and get it running on your machine in under two minutes. Creor is available for macOS, Windows, and Linux."
      toc={[
        { label: "System Requirements", href: "#system-requirements" },
        { label: "Download", href: "#download" },
        { label: "macOS", href: "#macos" },
        { label: "Windows", href: "#windows" },
        { label: "Linux", href: "#linux" },
        { label: "First Launch", href: "#first-launch" },
        { label: "Sign In", href: "#sign-in" },
      ]}
    >
      <DocsSection id="system-requirements" title="System Requirements">
        <DocsParagraph>
          Creor runs on most modern hardware. The AI engine runs locally alongside
          the editor, so having enough RAM matters more than GPU power.
        </DocsParagraph>
        <DocsTable
          headers={["Requirement", "Minimum", "Recommended"]}
          rows={[
            ["OS", "macOS 12+, Windows 10+, Ubuntu 20.04+", "macOS 14+, Windows 11, Ubuntu 22.04+"],
            ["CPU", "Dual-core x64 or Apple Silicon", "Quad-core or Apple M-series"],
            ["RAM", "4 GB", "8 GB or more"],
            ["Disk", "500 MB free", "2 GB free (for codebase indexing)"],
            ["Network", "Broadband internet", "Broadband internet"],
          ]}
        />
        <DocsCallout type="info">
          Creor uses cloud-hosted LLMs by default. You do not need a GPU or any
          local model weights to use AI features.
        </DocsCallout>
      </DocsSection>

      <DocsSection id="download" title="Download">
        <DocsParagraph>
          Download the latest stable release for your platform from the official
          website. All downloads are signed and notarized.
        </DocsParagraph>
        <DocsTable
          headers={["Platform", "Architecture", "Download"]}
          rows={[
            ["macOS", "Apple Silicon (M1/M2/M3/M4)", "creor.ai/download/mac-arm64"],
            ["macOS", "Intel x64", "creor.ai/download/mac-x64"],
            ["Windows", "x64", "creor.ai/download/win-x64"],
            ["Windows", "ARM64", "creor.ai/download/win-arm64"],
            ["Linux", "x64 (.deb)", "creor.ai/download/linux-deb-x64"],
            ["Linux", "x64 (.rpm)", "creor.ai/download/linux-rpm-x64"],
            ["Linux", "x64 (.tar.gz)", "creor.ai/download/linux-tar-x64"],
          ]}
        />
        <DocsParagraph>
          Not sure which architecture you have? On macOS, open About This Mac. On
          Windows, check Settings &gt; System &gt; About. On Linux, run
          &quot;uname -m&quot; in a terminal.
        </DocsParagraph>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="macos" title="macOS">
        <DocsH3>Install from DMG</DocsH3>
        <DocsList
          items={[
            "Open the downloaded .dmg file.",
            "Drag Creor into the Applications folder.",
            "Eject the disk image.",
            "Open Creor from Applications or Spotlight (Cmd + Space, type \"Creor\").",
          ]}
        />
        <DocsCallout type="warning">
          On first launch, macOS may show a &quot;Creor is from an identified
          developer&quot; dialog. Click Open to continue. If macOS blocks the app
          entirely, go to System Settings &gt; Privacy &amp; Security and click
          &quot;Open Anyway&quot;.
        </DocsCallout>

        <DocsH3>Install via Homebrew</DocsH3>
        <DocsParagraph>
          If you prefer a package manager, Creor is available as a Homebrew cask.
        </DocsParagraph>
        <DocsCode>{`brew install --cask creor`}</DocsCode>
        <DocsParagraph>
          To update later, run:
        </DocsParagraph>
        <DocsCode>{`brew upgrade --cask creor`}</DocsCode>

        <DocsH3>Shell command</DocsH3>
        <DocsParagraph>
          Creor installs a &quot;creor&quot; shell command automatically. You can open any
          folder in Creor from your terminal.
        </DocsParagraph>
        <DocsCode>{`creor .                  # open current directory
creor ~/projects/myapp   # open a specific folder`}</DocsCode>
        <DocsParagraph>
          If the command is not found, open the Command Palette inside Creor
          (Cmd + Shift + P) and run &quot;Install &apos;creor&apos; command in PATH&quot;.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="windows" title="Windows">
        <DocsH3>Install from setup executable</DocsH3>
        <DocsList
          items={[
            "Run the downloaded CreorSetup-x64.exe installer.",
            "Follow the installation wizard. The default install location is fine for most users.",
            "Optionally check \"Add to PATH\" and \"Add \'Open with Creor\' to context menu\" during setup.",
            "Click Install, then Finish.",
          ]}
        />
        <DocsParagraph>
          Creor will appear in your Start Menu. You can also launch it from the
          command line.
        </DocsParagraph>
        <DocsCode>{`creor .                  # open current directory
creor C:\\Projects\\myapp  # open a specific folder`}</DocsCode>

        <DocsCallout type="info">
          Windows SmartScreen may show a warning on first run because Creor is a
          new application. Click &quot;More info&quot; then &quot;Run anyway&quot;
          to proceed.
        </DocsCallout>

        <DocsH3>Install via winget</DocsH3>
        <DocsCode>{`winget install Creor.Creor`}</DocsCode>
      </DocsSection>

      <DocsSection id="linux" title="Linux">
        <DocsH3>Debian / Ubuntu (.deb)</DocsH3>
        <DocsCode>{`sudo dpkg -i creor_amd64.deb
sudo apt-get install -f   # resolve dependencies if needed`}</DocsCode>

        <DocsH3>Fedora / RHEL (.rpm)</DocsH3>
        <DocsCode>{`sudo rpm -i creor-x64.rpm`}</DocsCode>

        <DocsH3>Tarball (.tar.gz)</DocsH3>
        <DocsParagraph>
          Extract the archive and run the binary directly. This works on any
          distribution.
        </DocsParagraph>
        <DocsCode>{`tar -xzf creor-linux-x64.tar.gz
cd creor-linux-x64
./creor`}</DocsCode>

        <DocsH3>Shell command</DocsH3>
        <DocsParagraph>
          The .deb and .rpm packages add the &quot;creor&quot; command to your PATH
          automatically. If you used the tarball, create a symlink:
        </DocsParagraph>
        <DocsCode>{`sudo ln -s /path/to/creor-linux-x64/creor /usr/local/bin/creor`}</DocsCode>

        <DocsCallout type="tip">
          On Wayland, Creor runs natively. If you experience display issues, try
          launching with the &quot;--ozone-platform=wayland&quot; flag.
        </DocsCallout>
      </DocsSection>

      <DocsDivider />

      <DocsSection id="first-launch" title="First Launch">
        <DocsParagraph>
          When you open Creor for the first time, you will see the Welcome tab
          with a brief tour of the interface. Here is what to expect:
        </DocsParagraph>
        <DocsList
          items={[
            "Theme selection — pick a dark or light theme. Creor defaults to a dark theme optimized for long coding sessions.",
            "Font and layout — adjust editor font size and sidebar position. These can be changed anytime in Settings.",
            "Extensions — Creor ships with built-in support for most languages. You can install additional extensions from the marketplace.",
            "AI panel — the chat panel opens on the right side. This is where you interact with the AI agent.",
          ]}
        />
        <DocsParagraph>
          To open a project, use File &gt; Open Folder (Cmd + O on macOS,
          Ctrl + O on Windows/Linux) or drag a folder onto the Creor window.
        </DocsParagraph>
      </DocsSection>

      <DocsSection id="sign-in" title="Sign In">
        <DocsParagraph>
          Signing in unlocks the Creor Gateway (managed API access to all supported
          models), usage dashboard, cloud agents, and settings sync. You can use
          Creor without signing in if you bring your own API keys.
        </DocsParagraph>

        <DocsH3>Sign in with GitHub or Google</DocsH3>
        <DocsList
          items={[
            "Open the AI chat panel (Cmd + L on macOS, Ctrl + L on Windows/Linux).",
            "Click the \"Sign In\" button at the top of the panel.",
            "A browser window opens. Choose GitHub or Google to authenticate.",
            "After authenticating, you are redirected back to Creor. The panel now shows your account and available models.",
          ]}
        />

        <DocsH3>Using your own API keys (BYOK)</DocsH3>
        <DocsParagraph>
          If you prefer to use your own API keys instead of the Creor Gateway,
          open Settings (Cmd + ,) and navigate to AI &gt; Providers. Enter your
          API key for any supported provider — Anthropic, OpenAI, Google, and
          16 others. Your keys are stored securely in your OS keychain and never
          sent to Creor servers.
        </DocsParagraph>
        <DocsCallout type="tip">
          You can mix and match — use the Creor Gateway for some models and your
          own keys for others. The model picker shows which provider is active for
          each model.
        </DocsCallout>
      </DocsSection>
    </DocsPage>
  );
}
